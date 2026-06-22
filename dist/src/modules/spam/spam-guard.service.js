"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SpamGuardService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpamGuardService = exports.RATE_LIMIT_REPLY = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const redis_service_1 = require("../../infrastructure/redis/redis.service");
const queue_constants_1 = require("../../queues/queue.constants");
exports.RATE_LIMIT_REPLY = 'Dạ anh/chị gửi nhiều tin quá nhanh, em xin chờ chút rồi trả lời tiếp ạ 🙏';
let SpamGuardService = SpamGuardService_1 = class SpamGuardService {
    config;
    redis;
    aiQueue;
    sendQueue;
    logger = new common_1.Logger(SpamGuardService_1.name);
    constructor(config, redis, aiQueue, sendQueue) {
        this.config = config;
        this.redis = redis;
        this.aiQueue = aiQueue;
        this.sendQueue = sendQueue;
    }
    get rateLimitMax() {
        return this.config.get('RATE_LIMIT_MAX', 8);
    }
    get rateLimitWindowSec() {
        return this.config.get('RATE_LIMIT_WINDOW_SEC', 60);
    }
    get debounceMs() {
        return this.config.get('AI_DEBOUNCE_MS', 2000);
    }
    get replyCooldownSec() {
        return this.config.get('REPLY_COOLDOWN_SEC', 3);
    }
    get queueMaxWaiting() {
        return this.config.get('AI_QUEUE_MAX_WAITING', 200);
    }
    async isRateLimited(psid) {
        const key = `spam:rate:${psid}`;
        const client = this.redis.getClient();
        const count = await client.incr(key);
        if (count === 1) {
            await client.expire(key, this.rateLimitWindowSec);
        }
        return count > this.rateLimitMax;
    }
    async isCircuitOpen() {
        const waiting = await this.aiQueue.getWaitingCount();
        const delayed = await this.aiQueue.getDelayedCount();
        const total = waiting + delayed;
        if (total >= this.queueMaxWaiting) {
            this.logger.warn(`AI circuit open: ${total} jobs waiting`);
            return true;
        }
        return false;
    }
    async isReplyCooldown(conversationId) {
        const exists = await this.redis.getClient().exists(`spam:cooldown:${conversationId}`);
        return exists === 1;
    }
    async setReplyCooldown(conversationId) {
        await this.redis
            .getClient()
            .set(`spam:cooldown:${conversationId}`, '1', 'EX', this.replyCooldownSec);
    }
    async sendRateLimitReply(conversationId, recipientPsid) {
        const key = `spam:ratelimit:sent:${recipientPsid}`;
        const client = this.redis.getClient();
        const set = await client.set(key, '1', 'EX', this.rateLimitWindowSec, 'NX');
        if (set !== 'OK')
            return;
        await this.sendQueue.add(queue_constants_1.JOB_SEND_MESSAGE, {
            conversationId,
            recipientPsid,
            text: exports.RATE_LIMIT_REPLY,
            messageId: `ratelimit-${Date.now()}`,
        });
        this.logger.warn(`Rate limit reply sent to PSID ${recipientPsid}`);
    }
    async scheduleDebouncedAiJob(payload) {
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
                this.logger.debug(`Reset debounce delay for conversation ${payload.conversationId}`);
                return;
            }
            if (state === 'active') {
                await this.aiQueue.add(queue_constants_1.JOB_AI_PROCESSING, { conversationId: payload.conversationId, debounced: true }, {
                    jobId: `${jobId}-followup-${Date.now()}`,
                    delay: this.debounceMs,
                });
                return;
            }
            await existing.remove();
        }
        const job = await this.aiQueue.add(queue_constants_1.JOB_AI_PROCESSING, { conversationId: payload.conversationId, debounced: true }, { jobId, delay: this.debounceMs });
        const state = await job.getState();
        if (state !== 'delayed' && state !== 'waiting') {
            this.logger.error(`Failed to schedule debounced AI for ${payload.conversationId} (state=${state})`);
        }
    }
    async getPendingAiPayload(conversationId) {
        const raw = await this.redis
            .getClient()
            .get(`spam:ai:pending:${conversationId}`);
        if (!raw)
            return null;
        return JSON.parse(raw);
    }
    async clearPendingAiPayload(conversationId) {
        await this.redis.getClient().del(`spam:ai:pending:${conversationId}`);
    }
};
exports.SpamGuardService = SpamGuardService;
exports.SpamGuardService = SpamGuardService = SpamGuardService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, bullmq_1.InjectQueue)(queue_constants_1.QUEUE_AI_PROCESSING)),
    __param(3, (0, bullmq_1.InjectQueue)(queue_constants_1.QUEUE_SEND_MESSAGE)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        redis_service_1.RedisService,
        bullmq_2.Queue,
        bullmq_2.Queue])
], SpamGuardService);
//# sourceMappingURL=spam-guard.service.js.map