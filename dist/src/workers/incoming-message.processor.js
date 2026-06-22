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
var IncomingMessageProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncomingMessageProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const bullmq_2 = require("bullmq");
const customer_repository_1 = require("../modules/customer/repositories/customer.repository");
const conversation_service_1 = require("../modules/conversation/services/conversation.service");
const message_service_1 = require("../modules/message/services/message.service");
const facebook_service_1 = require("../infrastructure/facebook/facebook.service");
const spam_guard_service_1 = require("../modules/spam/spam-guard.service");
const queue_constants_1 = require("../queues/queue.constants");
let IncomingMessageProcessor = IncomingMessageProcessor_1 = class IncomingMessageProcessor extends bullmq_1.WorkerHost {
    customerRepo;
    conversationService;
    messageService;
    facebookService;
    spamGuard;
    logger = new common_1.Logger(IncomingMessageProcessor_1.name);
    constructor(customerRepo, conversationService, messageService, facebookService, spamGuard) {
        super();
        this.customerRepo = customerRepo;
        this.conversationService = conversationService;
        this.messageService = messageService;
        this.facebookService = facebookService;
        this.spamGuard = spamGuard;
    }
    async process(job) {
        if (job.name !== queue_constants_1.JOB_INCOMING_MESSAGE)
            return;
        const { facebookMessageId, senderPsid, text, recipientId } = job.data;
        this.logger.log(`Processing incoming message job ${job.id}`);
        try {
            const profile = await this.facebookService.getUserProfile(senderPsid);
            const customer = await this.customerRepo.upsertByPsid(senderPsid, {
                name: profile.name,
            });
            const conversation = await this.conversationService.getOrCreateActiveConversation(customer.id, recipientId);
            if (conversation.status === 'WAITING_HUMAN') {
                await this.conversationService.reactivateIfWaitingHuman(conversation.id);
                this.logger.log(`Reactivated conversation ${conversation.id}`);
            }
            const { message, isDuplicate } = await this.messageService.createInboundMessage({
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
        }
        catch (error) {
            this.logger.error(`Incoming message job failed: ${error instanceof Error ? error.message : error}`, error instanceof Error ? error.stack : undefined);
            throw error;
        }
    }
    onFailed(job, error) {
        this.logger.error(`Job ${job.id} failed after ${job.attemptsMade} attempts: ${error.message}`);
    }
};
exports.IncomingMessageProcessor = IncomingMessageProcessor;
__decorate([
    (0, bullmq_1.OnWorkerEvent)('failed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_2.Job, Error]),
    __metadata("design:returntype", void 0)
], IncomingMessageProcessor.prototype, "onFailed", null);
exports.IncomingMessageProcessor = IncomingMessageProcessor = IncomingMessageProcessor_1 = __decorate([
    (0, bullmq_1.Processor)(queue_constants_1.QUEUE_INCOMING_MESSAGE, { concurrency: 10 }),
    __metadata("design:paramtypes", [customer_repository_1.CustomerRepository,
        conversation_service_1.ConversationService,
        message_service_1.MessageService,
        facebook_service_1.FacebookService,
        spam_guard_service_1.SpamGuardService])
], IncomingMessageProcessor);
//# sourceMappingURL=incoming-message.processor.js.map