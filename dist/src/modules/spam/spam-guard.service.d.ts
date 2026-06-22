import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import { RedisService } from '../../infrastructure/redis/redis.service';
export interface AiJobPayload {
    conversationId: string;
    messageId: string;
    customerMessage: string;
    customerId: string;
    customerName?: string;
    recipientPsid: string;
}
export declare const RATE_LIMIT_REPLY = "D\u1EA1 anh/ch\u1ECB g\u1EEDi nhi\u1EC1u tin qu\u00E1 nhanh, em xin ch\u1EDD ch\u00FAt r\u1ED3i tr\u1EA3 l\u1EDDi ti\u1EBFp \u1EA1 \uD83D\uDE4F";
export declare class SpamGuardService {
    private readonly config;
    private readonly redis;
    private readonly aiQueue;
    private readonly sendQueue;
    private readonly logger;
    constructor(config: ConfigService, redis: RedisService, aiQueue: Queue, sendQueue: Queue);
    private get rateLimitMax();
    private get rateLimitWindowSec();
    private get debounceMs();
    private get replyCooldownSec();
    private get queueMaxWaiting();
    isRateLimited(psid: string): Promise<boolean>;
    isCircuitOpen(): Promise<boolean>;
    isReplyCooldown(conversationId: string): Promise<boolean>;
    setReplyCooldown(conversationId: string): Promise<void>;
    sendRateLimitReply(conversationId: string, recipientPsid: string): Promise<void>;
    scheduleDebouncedAiJob(payload: AiJobPayload): Promise<void>;
    getPendingAiPayload(conversationId: string): Promise<AiJobPayload | null>;
    clearPendingAiPayload(conversationId: string): Promise<void>;
}
