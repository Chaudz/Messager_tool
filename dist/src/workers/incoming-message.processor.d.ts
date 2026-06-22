import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { CustomerRepository } from '../modules/customer/repositories/customer.repository';
import { ConversationService } from '../modules/conversation/services/conversation.service';
import { MessageService } from '../modules/message/services/message.service';
import { FacebookService } from '../infrastructure/facebook/facebook.service';
import { SpamGuardService } from '../modules/spam/spam-guard.service';
interface IncomingMessageJobData {
    facebookMessageId: string;
    senderPsid: string;
    recipientId: string;
    text: string;
    timestamp: number;
    rawPayload: Record<string, unknown>;
}
export declare class IncomingMessageProcessor extends WorkerHost {
    private readonly customerRepo;
    private readonly conversationService;
    private readonly messageService;
    private readonly facebookService;
    private readonly spamGuard;
    private readonly logger;
    constructor(customerRepo: CustomerRepository, conversationService: ConversationService, messageService: MessageService, facebookService: FacebookService, spamGuard: SpamGuardService);
    process(job: Job<IncomingMessageJobData>): Promise<void>;
    onFailed(job: Job, error: Error): void;
}
export {};
