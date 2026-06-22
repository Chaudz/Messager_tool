import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';

@Injectable()
export class AiLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.AiLogCreateInput) {
    return this.prisma.aiLog.create({ data });
  }

  findMany(page: number, limit: number, conversationId?: string) {
    const where = conversationId ? { conversationId } : {};
    return this.prisma.$transaction([
      this.prisma.aiLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.aiLog.count({ where }),
    ]);
  }

  getStats() {
    return this.prisma.aiLog.aggregate({
      _sum: {
        promptTokens: true,
        completionTokens: true,
        totalTokens: true,
      },
      _count: true,
    });
  }
}
