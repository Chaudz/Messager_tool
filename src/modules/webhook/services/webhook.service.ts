import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import {
  JOB_INCOMING_MESSAGE,
  QUEUE_INCOMING_MESSAGE,
} from '../../../queues/queue.constants';

export interface FacebookMessagingEvent {
  sender: { id: string };
  recipient: { id: string };
  timestamp: number;
  message?: {
    mid: string;
    text?: string;
  };
}

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly config: ConfigService,
    @InjectQueue(QUEUE_INCOMING_MESSAGE)
    private readonly incomingQueue: Queue,
  ) {}

  verifyWebhook(mode: string, token: string, challenge: string): string | null {
    const verifyToken = this.config.get<string>('FACEBOOK_VERIFY_TOKEN');
    if (mode === 'subscribe' && token === verifyToken) {
      this.logger.log('Webhook verified successfully');
      return challenge;
    }
    this.logger.warn(
      `Webhook verification failed: mode=${mode}, tokenMatch=${token === verifyToken}`,
    );
    return null;
  }

  async handleWebhookPayload(body: {
    object?: string;
    entry?: Array<{
      messaging?: FacebookMessagingEvent[];
    }>;
  }) {
    if (body.object !== 'page') return;

    for (const entry of body.entry ?? []) {
      for (const event of entry.messaging ?? []) {
        if (!event.message?.text || !event.message.mid) continue;

        this.logger.log(
          `Enqueue incoming message from PSID ${event.sender.id}: ${event.message.text}`,
        );

        await this.incomingQueue.add(
          JOB_INCOMING_MESSAGE,
          {
            facebookMessageId: event.message.mid,
            senderPsid: event.sender.id,
            recipientId: event.recipient.id,
            text: event.message.text,
            timestamp: event.timestamp,
            rawPayload: event,
          },
          { jobId: event.message.mid },
        );
      }
    }
  }
}
