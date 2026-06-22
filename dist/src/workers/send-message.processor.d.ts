import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { FacebookService } from '../infrastructure/facebook/facebook.service';
interface SendMessageJobData {
    conversationId: string;
    recipientPsid: string;
    text: string;
    messageId: string;
}
export declare class SendMessageProcessor extends WorkerHost {
    private readonly facebookService;
    private readonly logger;
    constructor(facebookService: FacebookService);
    process(job: Job<SendMessageJobData>): Promise<void>;
    onFailed(job: Job, error: Error): void;
}
export {};
