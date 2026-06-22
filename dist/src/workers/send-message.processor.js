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
var SendMessageProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMessageProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const bullmq_2 = require("bullmq");
const facebook_service_1 = require("../infrastructure/facebook/facebook.service");
const queue_constants_1 = require("../queues/queue.constants");
let SendMessageProcessor = SendMessageProcessor_1 = class SendMessageProcessor extends bullmq_1.WorkerHost {
    facebookService;
    logger = new common_1.Logger(SendMessageProcessor_1.name);
    constructor(facebookService) {
        super();
        this.facebookService = facebookService;
    }
    async process(job) {
        if (job.name !== queue_constants_1.JOB_SEND_MESSAGE)
            return;
        this.logger.log(`Sending message to PSID ${job.data.recipientPsid}: ${job.data.text.substring(0, 50)}...`);
        try {
            await this.facebookService.sendTextMessage({
                recipientPsid: job.data.recipientPsid,
                text: job.data.text,
            });
        }
        catch (error) {
            this.logger.error(`Failed to send message ${job.data.messageId}: ${error instanceof Error ? error.message : error}`);
            throw error;
        }
    }
    onFailed(job, error) {
        this.logger.error(`Send job ${job.id} failed after ${job.attemptsMade} attempts: ${error.message}`);
    }
};
exports.SendMessageProcessor = SendMessageProcessor;
__decorate([
    (0, bullmq_1.OnWorkerEvent)('failed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_2.Job, Error]),
    __metadata("design:returntype", void 0)
], SendMessageProcessor.prototype, "onFailed", null);
exports.SendMessageProcessor = SendMessageProcessor = SendMessageProcessor_1 = __decorate([
    (0, bullmq_1.Processor)(queue_constants_1.QUEUE_SEND_MESSAGE, { concurrency: 10 }),
    __metadata("design:paramtypes", [facebook_service_1.FacebookService])
], SendMessageProcessor);
//# sourceMappingURL=send-message.processor.js.map