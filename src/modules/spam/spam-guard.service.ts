import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { RedisService } from '../../infrastructure/redis/redis.service';
import {
  JOB_AI_PROCESSING,
  JOB_SEND_MESSAGE,
  QUEUE_AI_PROCESSING,
  QUEUE_SEND_MESSAGE,
} from '../../queues/queue.constants';

export interface AiJobPayload {
  conversationId: string;
  messageId: string;
  customerMessage: string;
  customerId: string;
  customerName?: string;
  recipientPsid: string;
}

export const RATE_LIMIT_REPLY =
  'Dạ anh/chị gửi nhiều tin quá nhanh, em xin chờ chút rồi trả lời tiếp ạ 🙏';

@Injectable()
export class SpamGuardService {
  private readonly logger = new Logger(SpamGuardService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly redis: RedisService,
    @InjectQueue(QUEUE_AI_PROCESSING) private readonly aiQueue: Queue,
    @InjectQueue(QUEUE_SEND_MESSAGE) private readonly sendQueue: Queue,
  ) {}

  private get rateLimitMax(): number {
    return this.config.get<number>('RATE_LIMIT_MAX', 8);
  }

  private get rateLimitWindowSec(): number {
    return this.config.get<number>('RATE_LIMIT_WINDOW_SEC', 60);
  }

  private get debounceMs(): number {
    return this.config.get<number>('AI_DEBOUNCE_MS', 2000);
  }

  private get replyCooldownSec(): number {
    return this.config.get<number>('REPLY_COOLDOWN_SEC', 3);
  }

  private get queueMaxWaiting(): number {
    return this.config.get<number>('AI_QUEUE_MAX_WAITING', 200);
  }

  /** Sliding window rate limit theo PSID */
  async isRateLimited(psid: string): Promise<boolean> {
    const key = `spam:rate:${psid}`;
    const client = this.redis.getClient();
    const count = await client.incr(key);
    if (count === 1) {
      await client.expire(key, this.rateLimitWindowSec);
    }
    return count > this.rateLimitMax;
  }

  /** Circuit breaker — queue AI quá dài */
  async isCircuitOpen(): Promise<boolean> {
    const waiting = await this.aiQueue.getWaitingCount();
    const delayed = await this.aiQueue.getDelayedCount();
    const total = waiting + delayed;
    if (total >= this.queueMaxWaiting) {
      this.logger.warn(`AI circuit open: ${total} jobs waiting`);
      return true;
    }
    return false;
  }

  /** Cooldown giữa các reply AI cho cùng conversation */
  async isReplyCooldown(conversationId: string): Promise<boolean> {
    const exists = await this.redis.getClient().exists(
      `spam:cooldown:${conversationId}`,
    );
    return exists === 1;
  }

  async setReplyCooldown(conversationId: string): Promise<void> {
    await this.redis
      .getClient()
      .set(`spam:cooldown:${conversationId}`, '1', 'EX', this.replyCooldownSec);
  }

  /** Gửi cảnh báo rate limit (tối đa 1 lần / window) */
  async sendRateLimitReply(
    conversationId: string,
    recipientPsid: string,
  ): Promise<void> {
    const key = `spam:ratelimit:sent:${recipientPsid}`;
    const client = this.redis.getClient();
    const set = await client.set(key, '1', 'EX', this.rateLimitWindowSec, 'NX');
    if (set !== 'OK') return;

    await this.sendQueue.add(JOB_SEND_MESSAGE, {
      conversationId,
      recipientPsid,
      text: RATE_LIMIT_REPLY,
      messageId: `ratelimit-${Date.now()}`,
    });
    this.logger.warn(`Rate limit reply sent to PSID ${recipientPsid}`);
  }

  /** Debounce: gộp tin liên tiếp, chỉ 1 job AI sau debounceMs */
  async scheduleDebouncedAiJob(payload: AiJobPayload): Promise<void> {
    const redisKey = `spam:ai:pending:${payload.conversationId}`;
    await this.redis
      .getClient()
      .set(redisKey, JSON.stringify(payload), 'EX', 120);

    const jobId = `ai-debounce-${payload.conversationId}`;
    const existing = await this.aiQueue.getJob(jobId);

    if (existing) {
      const state = await existing.getState();
      if (state === 'delayed') {
        await existing.changeDelay(this.debounceMs);
        this.logger.debug(
          `Reset debounce delay for conversation ${payload.conversationId}`,
        );
        return;
      }
      if (state === 'active') {
        // Job đang chạy — payload Redis đã cập nhật, hẹn job follow-up
        await this.aiQueue.add(
          JOB_AI_PROCESSING,
          { conversationId: payload.conversationId, debounced: true },
          {
            jobId: `${jobId}-followup-${Date.now()}`,
            delay: this.debounceMs,
          },
        );
        return;
      }
      // completed / failed / waiting — xóa job cũ để jobId có thể tái sử dụng
      await existing.remove();
    }

    const job = await this.aiQueue.add(
      JOB_AI_PROCESSING,
      { conversationId: payload.conversationId, debounced: true },
      { jobId, delay: this.debounceMs },
    );

    const state = await job.getState();
    if (state !== 'delayed' && state !== 'waiting') {
      this.logger.error(
        `Failed to schedule debounced AI for ${payload.conversationId} (state=${state})`,
      );
    }
  }

  async getPendingAiPayload(
    conversationId: string,
  ): Promise<AiJobPayload | null> {
    const raw = await this.redis
      .getClient()
      .get(`spam:ai:pending:${conversationId}`);
    if (!raw) return null;
    return JSON.parse(raw) as AiJobPayload;
  }

  async clearPendingAiPayload(conversationId: string): Promise<void> {
    await this.redis.getClient().del(`spam:ai:pending:${conversationId}`);
  }
}
