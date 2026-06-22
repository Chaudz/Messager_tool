import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
export declare class AiLogRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.AiLogCreateInput): Prisma.Prisma__AiLogClient<{
        id: string;
        createdAt: Date;
        model: string;
        rawResponse: string | null;
        latencyMs: number;
        conversationId: string;
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
        intentDetected: import("@prisma/client").$Enums.Intent;
        confidence: Prisma.Decimal;
        contextUsed: Prisma.JsonValue;
        messageId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    findMany(page: number, limit: number, conversationId?: string): Promise<[{
        id: string;
        createdAt: Date;
        model: string;
        rawResponse: string | null;
        latencyMs: number;
        conversationId: string;
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
        intentDetected: import("@prisma/client").$Enums.Intent;
        confidence: Prisma.Decimal;
        contextUsed: Prisma.JsonValue;
        messageId: string | null;
    }[], number]>;
    getStats(): Prisma.PrismaPromise<Prisma.GetAiLogAggregateType<{
        _sum: {
            promptTokens: true;
            completionTokens: true;
            totalTokens: true;
        };
        _count: true;
    }>>;
}
