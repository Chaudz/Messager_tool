import { WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { AiOrchestratorService } from '../modules/ai/services/ai-orchestrator.service';
import { SpamGuardService } from '../modules/spam/spam-guard.service';
interface AiProcessingJobData {
    conversationId: string;
    debounced?: boolean;
    messageId?: string;
    customerMessage?: string;
    customerId?: string;
    customerName?: string;
    recipientPsid?: string;
}
export declare class AiProcessingProcessor extends WorkerHost {
    private readonly aiOrchestrator;
    private readonly spamGuard;
    private readonly sendQueue;
    private readonly logger;
    constructor(aiOrchestrator: AiOrchestratorService, spamGuard: SpamGuardService, sendQueue: Queue);
    process(job: Job<AiProcessingJobData>): Promise<void>;
    onFailed(job: Job, error: Error): void;
}
export {};
