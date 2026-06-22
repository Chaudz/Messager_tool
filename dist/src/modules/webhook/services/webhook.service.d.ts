import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';
export interface FacebookMessagingEvent {
    sender: {
        id: string;
    };
    recipient: {
        id: string;
    };
    timestamp: number;
    message?: {
        mid: string;
        text?: string;
    };
}
export declare class WebhookService {
    private readonly config;
    private readonly incomingQueue;
    private readonly logger;
    constructor(config: ConfigService, incomingQueue: Queue);
    verifyWebhook(mode: string, token: string, challenge: string): string | null;
    handleWebhookPayload(body: {
        object?: string;
        entry?: Array<{
            messaging?: FacebookMessagingEvent[];
        }>;
    }): Promise<void>;
}
