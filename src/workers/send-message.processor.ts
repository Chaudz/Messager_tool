import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { FacebookService } from '../infrastructure/facebook/facebook.service';
import {
  JOB_SEND_MESSAGE,
  QUEUE_SEND_MESSAGE,
} from '../queues/queue.constants';

interface SendMessageJobData {
  conversationId: string;
  recipientPsid: string;
  text: string;
  messageId: string;
}

@Processor(QUEUE_SEND_MESSAGE, { concurrency: 10 })
export class SendMessageProcessor extends WorkerHost {
  private readonly logger = new Logger(SendMessageProcessor.name);

  constructor(private readonly facebookService: FacebookService) {
    super();
  }

  async process(job: Job<SendMessageJobData>) {
    if (job.name !== JOB_SEND_MESSAGE) return;

    this.logger.log(
      `Sending message to PSID ${job.data.recipientPsid}: ${job.data.text.substring(0, 50)}...`,
    );

    try {
      await this.facebookService.sendTextMessage({
        recipientPsid: job.data.recipientPsid,
        text: job.data.text,
      });
    } catch (error) {
      this.logger.error(
        `Failed to send message ${job.data.messageId}: ${error instanceof Error ? error.message : error}`,
      );
      throw error;
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(
      `Send job ${job.id} failed after ${job.attemptsMade} attempts: ${error.message}`,
    );
  }
}
