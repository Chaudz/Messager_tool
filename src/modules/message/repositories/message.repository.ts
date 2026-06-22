import { Injectable } from '@nestjs/common';
import {
  Message,
  MessageDirection,
  Prisma,
  SenderType,
} from '@prisma/client';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';

@Injectable()
export class MessageRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByFacebookMessageId(facebookMessageId: string): Promise<Message | null> {
    return this.prisma.message.findUnique({ where: { facebookMessageId } });
  }

  create(data: Prisma.MessageCreateInput): Promise<Message> {
    return this.prisma.message.create({ data });
  }

  findRecentByConversation(conversationId: string, take = 10) {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take,
    });
  }
}
