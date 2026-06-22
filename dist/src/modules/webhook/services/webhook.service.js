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
var WebhookService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const config_1 = require("@nestjs/config");
const queue_constants_1 = require("../../../queues/queue.constants");
let WebhookService = WebhookService_1 = class WebhookService {
    config;
    incomingQueue;
    logger = new common_1.Logger(WebhookService_1.name);
    constructor(config, incomingQueue) {
        this.config = config;
        this.incomingQueue = incomingQueue;
    }
    verifyWebhook(mode, token, challenge) {
        const verifyToken = this.config.get('FACEBOOK_VERIFY_TOKEN');
        if (mode === 'subscribe' && token === verifyToken) {
            this.logger.log('Webhook verified successfully');
            return challenge;
        }
        this.logger.warn(`Webhook verification failed: mode=${mode}, tokenMatch=${token === verifyToken}`);
        return null;
    }
    async handleWebhookPayload(body) {
        if (body.object !== 'page')
            return;
        for (const entry of body.entry ?? []) {
            for (const event of entry.messaging ?? []) {
                if (!event.message?.text || !event.message.mid)
                    continue;
                this.logger.log(`Enqueue incoming message from PSID ${event.sender.id}: ${event.message.text}`);
                await this.incomingQueue.add(queue_constants_1.JOB_INCOMING_MESSAGE, {
                    facebookMessageId: event.message.mid,
                    senderPsid: event.sender.id,
                    recipientId: event.recipient.id,
                    text: event.message.text,
                    timestamp: event.timestamp,
                    rawPayload: event,
                }, { jobId: event.message.mid });
            }
        }
    }
};
exports.WebhookService = WebhookService;
exports.WebhookService = WebhookService = WebhookService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bullmq_1.InjectQueue)(queue_constants_1.QUEUE_INCOMING_MESSAGE)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        bullmq_2.Queue])
], WebhookService);
//# sourceMappingURL=webhook.service.js.map