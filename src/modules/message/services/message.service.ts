import { Injectable, Logger } from '@nestjs/common';
import { Intent, Prisma, SenderType, Message } from '@prisma/client';
import { MessageRepository } from '../repositories/message.repository';
import { ConversationService } from '../../conversation/services/conversation.service';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    private readonly messageRepo: MessageRepository,
    private readonly conversationService: ConversationService,
  ) {}

  async createInboundMessage(params: {
    conversationId: string;
    facebookMessageId: string;
    content: string;
    metadataJson?: Record<string, unknown>;
  }): Promise<{ message: Message; isDuplicate: boolean }> {
    const existing = await this.messageRepo.findByFacebookMessageId(
      params.facebookMessageId,
    );
    if (existing) {
      this.logger.log(`Duplicate message ${params.facebookMessageId}, skipping`);
      return { message: existing, isDuplicate: true };
    }

    const message = await this.messageRepo.create({
      conversation: { connect: { id: params.conversationId } },
      facebookMessageId: params.facebookMessageId,
      direction: 'INBOUND',
      senderType: SenderType.CUSTOMER,
      content: params.content,
      metadataJson: params.metadataJson as Prisma.InputJsonValue | undefined,
    });

    await this.conversationService.touchLastMessage(params.conversationId);
    this.logger.log(`Incoming message saved: ${message.id}`);
    return { message, isDuplicate: false };
  }

  async createOutboundAiMessage(params: {
    conversationId: string;
    content: string;
    intent?: Intent;
    intentConfidence?: number;
  }) {
    const message = await this.messageRepo.create({
      conversation: { connect: { id: params.conversationId } },
      direction: 'OUTBOUND',
      senderType: SenderType.AI,
      content: params.content,
      intent: params.intent,
      intentConfidence: params.intentConfidence,
    });

    await this.conversationService.touchLastMessage(params.conversationId);
    this.logger.log(`Outgoing AI message saved: ${message.id}`);
    return message;
  }

  createOutboundStaffMessage(conversationId: string, content: string) {
    return this.messageRepo.create({
      conversation: { connect: { id: conversationId } },
      direction: 'OUTBOUND',
      senderType: SenderType.STAFF,
      content,
    });
  }

  createSystemMessage(conversationId: string, content: string) {
    return this.messageRepo.create({
      conversation: { connect: { id: conversationId } },
      direction: 'OUTBOUND',
      senderType: SenderType.SYSTEM,
      content,
    });
  }

  getRecentHistory(conversationId: string, take = 10) {
    return this.messageRepo.findRecentByConversation(conversationId, take);
  }
}
