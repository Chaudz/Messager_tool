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
var MessageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const message_repository_1 = require("../repositories/message.repository");
const conversation_service_1 = require("../../conversation/services/conversation.service");
let MessageService = MessageService_1 = class MessageService {
    messageRepo;
    conversationService;
    logger = new common_1.Logger(MessageService_1.name);
    constructor(messageRepo, conversationService) {
        this.messageRepo = messageRepo;
        this.conversationService = conversationService;
    }
    async createInboundMessage(params) {
        const existing = await this.messageRepo.findByFacebookMessageId(params.facebookMessageId);
        if (existing) {
            this.logger.log(`Duplicate message ${params.facebookMessageId}, skipping`);
            return { message: existing, isDuplicate: true };
        }
        const message = await this.messageRepo.create({
            conversation: { connect: { id: params.conversationId } },
            facebookMessageId: params.facebookMessageId,
            direction: 'INBOUND',
            senderType: client_1.SenderType.CUSTOMER,
            content: params.content,
            metadataJson: params.metadataJson,
        });
        await this.conversationService.touchLastMessage(params.conversationId);
        this.logger.log(`Incoming message saved: ${message.id}`);
        return { message, isDuplicate: false };
    }
    async createOutboundAiMessage(params) {
        const message = await this.messageRepo.create({
            conversation: { connect: { id: params.conversationId } },
            direction: 'OUTBOUND',
            senderType: client_1.SenderType.AI,
            content: params.content,
            intent: params.intent,
            intentConfidence: params.intentConfidence,
        });
        await this.conversationService.touchLastMessage(params.conversationId);
        this.logger.log(`Outgoing AI message saved: ${message.id}`);
        return message;
    }
    createOutboundStaffMessage(conversationId, content) {
        return this.messageRepo.create({
            conversation: { connect: { id: conversationId } },
            direction: 'OUTBOUND',
            senderType: client_1.SenderType.STAFF,
            content,
        });
    }
    createSystemMessage(conversationId, content) {
        return this.messageRepo.create({
            conversation: { connect: { id: conversationId } },
            direction: 'OUTBOUND',
            senderType: client_1.SenderType.SYSTEM,
            content,
        });
    }
    getRecentHistory(conversationId, take = 10) {
        return this.messageRepo.findRecentByConversation(conversationId, take);
    }
};
exports.MessageService = MessageService;
exports.MessageService = MessageService = MessageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [message_repository_1.MessageRepository,
        conversation_service_1.ConversationService])
], MessageService);
//# sourceMappingURL=message.service.js.map