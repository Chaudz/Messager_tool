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
var AiProcessingProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiProcessingProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const bullmq_2 = require("bullmq");
const bullmq_3 = require("@nestjs/bullmq");
const ai_orchestrator_service_1 = require("../modules/ai/services/ai-orchestrator.service");
const spam_guard_service_1 = require("../modules/spam/spam-guard.service");
const queue_constants_1 = require("../queues/queue.constants");
let AiProcessingProcessor = AiProcessingProcessor_1 = class AiProcessingProcessor extends bullmq_1.WorkerHost {
    aiOrchestrator;
    spamGuard;
    sendQueue;
    logger = new common_1.Logger(AiProcessingProcessor_1.name);
    constructor(aiOrchestrator, spamGuard, sendQueue) {
        super();
        this.aiOrchestrator = aiOrchestrator;
        this.spamGuard = spamGuard;
        this.sendQueue = sendQueue;
    }
    async process(job) {
        if (job.name !== queue_constants_1.JOB_AI_PROCESSING)
            return;
        let payload = job.data;
        if (job.data.debounced) {
            const pending = await this.spamGuard.getPendingAiPayload(job.data.conversationId);
            if (!pending) {
                this.logger.log(`No pending payload for ${job.data.conversationId}`);
                return;
            }
            payload = { ...pending, debounced: true };
            await this.spamGuard.clearPendingAiPayload(job.data.conversationId);
        }
        if (!payload.messageId ||
            !payload.customerMessage ||
            !payload.recipientPsid) {
            this.logger.warn(`Invalid AI job payload for ${job.data.conversationId}`);
            return;
        }
        if (await this.spamGuard.isReplyCooldown(payload.conversationId)) {
            this.logger.log(`Reply cooldown active for ${payload.conversationId}, skip`);
            return;
        }
        this.logger.log(`Processing AI job ${job.id} for conversation ${payload.conversationId}`);
        const result = await this.aiOrchestrator.process({
            conversationId: payload.conversationId,
            messageId: payload.messageId,
            customerMessage: payload.customerMessage,
            customerId: payload.customerId,
            customerName: payload.customerName,
        });
        if (!result.responseText) {
            this.logger.log('No response to send');
            return;
        }
        await this.spamGuard.setReplyCooldown(payload.conversationId);
        await this.sendQueue.add(queue_constants_1.JOB_SEND_MESSAGE, {
            conversationId: payload.conversationId,
            recipientPsid: payload.recipientPsid,
            text: result.responseText,
            messageId: result.outboundMessageId,
        });
        this.logger.log(`Enqueued send job for PSID ${payload.recipientPsid}`);
    }
    onFailed(job, error) {
        this.logger.error(`AI job ${job.id} failed after ${job.attemptsMade} attempts: ${error.message}`);
    }
};
exports.AiProcessingProcessor = AiProcessingProcessor;
__decorate([
    (0, bullmq_1.OnWorkerEvent)('failed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_2.Job, Error]),
    __metadata("design:returntype", void 0)
], AiProcessingProcessor.prototype, "onFailed", null);
exports.AiProcessingProcessor = AiProcessingProcessor = AiProcessingProcessor_1 = __decorate([
    (0, bullmq_1.Processor)(queue_constants_1.QUEUE_AI_PROCESSING, {
        concurrency: 5,
        limiter: { max: 20, duration: 60000 },
    }),
    __param(2, (0, bullmq_3.InjectQueue)(queue_constants_1.QUEUE_SEND_MESSAGE)),
    __metadata("design:paramtypes", [ai_orchestrator_service_1.AiOrchestratorService,
        spam_guard_service_1.SpamGuardService,
        bullmq_2.Queue])
], AiProcessingProcessor);
//# sourceMappingURL=ai-processing.processor.js.map