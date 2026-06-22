import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { CustomerRepository } from '../modules/customer/repositories/customer.repository';
import { ConversationService } from '../modules/conversation/services/conversation.service';
import { MessageService } from '../modules/message/services/message.service';
import { FacebookService } from '../infrastructure/facebook/facebook.service';
import { SpamGuardService } from '../modules/spam/spam-guard.service';
import {
  JOB_INCOMING_MESSAGE,
  QUEUE_INCOMING_MESSAGE,
} from '../queues/queue.constants';

interface IncomingMessageJobData {
  facebookMessageId: string;
  senderPsid: string;
  recipientId: string;
  text: string;
  timestamp: number;
  rawPayload: Record<string, unknown>;
}

@Processor(QUEUE_INCOMING_MESSAGE, { concurrency: 10 })
export class IncomingMessageProcessor extends WorkerHost {
  private readonly logger = new Logger(IncomingMessageProcessor.name);

  constructor(
    private readonly customerRepo: CustomerRepository,
    private readonly conversationService: ConversationService,
    private readonly messageService: MessageService,
    private readonly facebookService: FacebookService,
    private readonly spamGuard: SpamGuardService,
  ) {
    super();
  }

  async process(job: Job<IncomingMessageJobData>) {
    if (job.name !== JOB_INCOMING_MESSAGE) return;

    const { facebookMessageId, senderPsid, text, recipientId } = job.data;
    this.logger.log(`Processing incoming message job ${job.id}`);

    try {
      const profile = await this.facebookService.getUserProfile(senderPsid);
      const customer = await this.customerRepo.upsertByPsid(senderPsid, {
        name: profile.name,
      });

      const conversation =
        await this.conversationService.getOrCreateActiveConversation(
          customer.id,
          recipientId,
        );

      if (conversation.status === 'WAITING_HUMAN') {
        await this.conversationService.reactivateIfWaitingHuman(conversation.id);
        this.logger.log(`Reactivated conversation ${conversation.id}`);
      }

      const { message, isDuplicate } =
        await this.messageService.createInboundMessage({
          conversationId: conversation.id,
          facebookMessageId,
          content: text,
          metadataJson: job.data.rawPayload,
        });

      if (isDuplicate) {
        this.logger.log(`Duplicate ${facebookMessageId}, skip AI enqueue`);
        return;
      }

      if (await this.spamGuard.isRateLimited(senderPsid)) {
        await this.spamGuard.sendRateLimitReply(conversation.id, senderPsid);
        return;
      }

      if (await this.spamGuard.isCircuitOpen()) {
        this.logger.warn(`Circuit open, skip AI for message ${message.id}`);
        return;
      }

      await this.spamGuard.scheduleDebouncedAiJob({
        conversationId: conversation.id,
        messageId: message.id,
        customerMessage: text,
        customerId: customer.id,
        customerName: customer.name ?? profile.name,
        recipientPsid: senderPsid,
      });

      this.logger.log(`Scheduled debounced AI for message ${message.id}`);
    } catch (error) {
      this.logger.error(
        `Incoming message job failed: ${error instanceof Error ? error.message : error}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(
      `Job ${job.id} failed after ${job.attemptsMade} attempts: ${error.message}`,
    );
  }
}
