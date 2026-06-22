import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { AiOrchestratorService } from '../modules/ai/services/ai-orchestrator.service';
import { SpamGuardService } from '../modules/spam/spam-guard.service';
import {
  JOB_AI_PROCESSING,
  JOB_SEND_MESSAGE,
  QUEUE_AI_PROCESSING,
  QUEUE_SEND_MESSAGE,
} from '../queues/queue.constants';

interface AiProcessingJobData {
  conversationId: string;
  debounced?: boolean;
  messageId?: string;
  customerMessage?: string;
  customerId?: string;
  customerName?: string;
  recipientPsid?: string;
}

@Processor(QUEUE_AI_PROCESSING, {
  concurrency: 5,
  limiter: { max: 20, duration: 60000 },
})
export class AiProcessingProcessor extends WorkerHost {
  private readonly logger = new Logger(AiProcessingProcessor.name);

  constructor(
    private readonly aiOrchestrator: AiOrchestratorService,
    private readonly spamGuard: SpamGuardService,
    @InjectQueue(QUEUE_SEND_MESSAGE) private readonly sendQueue: Queue,
  ) {
    super();
  }

  async process(job: Job<AiProcessingJobData>) {
    if (job.name !== JOB_AI_PROCESSING) return;

    let payload = job.data;
    if (job.data.debounced) {
      const pending = await this.spamGuard.getPendingAiPayload(
        job.data.conversationId,
      );
      if (!pending) {
        this.logger.log(`No pending payload for ${job.data.conversationId}`);
        return;
      }
      payload = { ...pending, debounced: true };
      await this.spamGuard.clearPendingAiPayload(job.data.conversationId);
    }

    if (
      !payload.messageId ||
      !payload.customerMessage ||
      !payload.recipientPsid
    ) {
      this.logger.warn(`Invalid AI job payload for ${job.data.conversationId}`);
      return;
    }

    if (await this.spamGuard.isReplyCooldown(payload.conversationId)) {
      this.logger.log(
        `Reply cooldown active for ${payload.conversationId}, skip`,
      );
      return;
    }

    this.logger.log(
      `Processing AI job ${job.id} for conversation ${payload.conversationId}`,
    );

    const result = await this.aiOrchestrator.process({
      conversationId: payload.conversationId,
      messageId: payload.messageId,
      customerMessage: payload.customerMessage,
      customerId: payload.customerId!,
      customerName: payload.customerName,
    });

    if (!result.responseText) {
      this.logger.log('No response to send');
      return;
    }

    await this.spamGuard.setReplyCooldown(payload.conversationId);

    await this.sendQueue.add(JOB_SEND_MESSAGE, {
      conversationId: payload.conversationId,
      recipientPsid: payload.recipientPsid,
      text: result.responseText,
      messageId: result.outboundMessageId,
    });

    this.logger.log(`Enqueued send job for PSID ${payload.recipientPsid}`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(
      `AI job ${job.id} failed after ${job.attemptsMade} attempts: ${error.message}`,
    );
  }
}
