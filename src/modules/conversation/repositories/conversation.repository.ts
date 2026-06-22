import { Injectable } from '@nestjs/common';
import {
  Conversation,
  ConversationStatus,
  Intent,
  Prisma,
} from '@prisma/client';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';

@Injectable()
export class ConversationRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string) {
    return this.prisma.conversation.findUnique({
      where: { id },
      include: {
        customer: true,
        messages: { orderBy: { createdAt: 'asc' }, take: 50 },
      },
    });
  }

  findActiveByCustomerId(customerId: string): Promise<Conversation | null> {
    return this.prisma.conversation.findFirst({
      where: {
        customerId,
        status: { in: [ConversationStatus.ACTIVE, ConversationStatus.WAITING_HUMAN] },
      },
      orderBy: { lastMessageAt: 'desc' },
    });
  }

  create(data: Prisma.ConversationCreateInput): Promise<Conversation> {
    return this.prisma.conversation.create({ data });
  }

  update(id: string, data: Prisma.ConversationUpdateInput) {
    return this.prisma.conversation.update({ where: { id }, data });
  }

  findMany(params: {
    page: number;
    limit: number;
    status?: ConversationStatus;
  }) {
    const { page, limit, status } = params;
    const where: Prisma.ConversationWhereInput = status ? { status } : {};

    return this.prisma.$transaction([
      this.prisma.conversation.findMany({
        where,
        include: { customer: true, messages: { take: 1, orderBy: { createdAt: 'desc' } } },
        orderBy: { lastMessageAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.conversation.count({ where }),
    ]);
  }

  setIntent(id: string, intent: Intent, contextJson?: Prisma.InputJsonValue) {
    return this.prisma.conversation.update({
      where: { id },
      data: {
        currentIntent: intent,
        ...(contextJson !== undefined ? { contextJson } : {}),
      },
    });
  }
}
