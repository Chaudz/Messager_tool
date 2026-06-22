import { Injectable, Logger } from '@nestjs/common';
import { Intent } from '@prisma/client';
import { ConversationService } from '../../conversation/services/conversation.service';
import { HANDOFF_MESSAGE } from '../prompts/system.prompt';

@Injectable()
export class HandoffService {
  private readonly logger = new Logger(HandoffService.name);

  constructor(private readonly conversationService: ConversationService) {}

  async trigger(conversationId: string): Promise<string> {
    await this.conversationService.markWaitingHuman(conversationId);
    this.logger.log(`Human handoff triggered for conversation ${conversationId}`);
    return HANDOFF_MESSAGE;
  }
}
