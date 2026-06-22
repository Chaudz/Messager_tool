import { ApiResponse } from '../../../common/utils/api-response';
import { AiLogRepository } from '../repositories/ai-log.repository';
export declare class AiLogController {
    private readonly aiLogRepo;
    constructor(aiLogRepo: AiLogRepository);
    list(page?: string, limit?: string, conversationId?: string): Promise<ApiResponse<{
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
        confidence: import("@prisma/client/runtime/library").Decimal;
        contextUsed: import("@prisma/client/runtime/library").JsonValue;
        messageId: string | null;
    }[]>>;
    stats(): Promise<ApiResponse<import("@prisma/client").Prisma.GetAiLogAggregateType<{
        _sum: {
            promptTokens: true;
            completionTokens: true;
            totalTokens: true;
        };
        _count: true;
    }>>>;
}
