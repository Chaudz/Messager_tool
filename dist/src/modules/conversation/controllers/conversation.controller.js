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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const api_response_1 = require("../../../common/utils/api-response");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const conversation_service_1 = require("../services/conversation.service");
const reply_conversation_dto_1 = require("../dtos/reply-conversation.dto");
const message_service_1 = require("../../message/services/message.service");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const queue_constants_1 = require("../../../queues/queue.constants");
let ConversationController = class ConversationController {
    conversationService;
    messageService;
    sendQueue;
    constructor(conversationService, messageService, sendQueue) {
        this.conversationService = conversationService;
        this.messageService = messageService;
        this.sendQueue = sendQueue;
    }
    async list(page = '1', limit = '20', status) {
        const [items, total] = await this.conversationService.findMany(Number(page), Number(limit), status);
        return api_response_1.ApiResponse.ok(items, {
            page: Number(page),
            limit: Number(limit),
            total,
        });
    }
    async detail(id) {
        const conversation = await this.conversationService.findById(id);
        return api_response_1.ApiResponse.ok(conversation);
    }
    async reply(id, dto) {
        const conversation = await this.conversationService.findById(id);
        if (!conversation) {
            return api_response_1.ApiResponse.fail('NOT_FOUND', 'Conversation not found');
        }
        const message = await this.messageService.createOutboundStaffMessage(id, dto.content);
        await this.sendQueue.add(queue_constants_1.JOB_SEND_MESSAGE, {
            conversationId: id,
            recipientPsid: conversation.customer.facebookPsid,
            text: dto.content,
            messageId: message.id,
        });
        return api_response_1.ApiResponse.ok(message);
    }
    async close(id) {
        const conversation = await this.conversationService.close(id);
        return api_response_1.ApiResponse.ok(conversation);
    }
    async toggleAi(id, aiEnabled) {
        const conversation = await this.conversationService.toggleAi(id, aiEnabled);
        return api_response_1.ApiResponse.ok(conversation);
    }
    async assign(id, staffId) {
        const conversation = await this.conversationService.assignStaff(id, staffId);
        return api_response_1.ApiResponse.ok(conversation);
    }
};
exports.ConversationController = ConversationController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "detail", null);
__decorate([
    (0, common_1.Post)(':id/reply'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reply_conversation_dto_1.ReplyConversationDto]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "reply", null);
__decorate([
    (0, common_1.Patch)(':id/close'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "close", null);
__decorate([
    (0, common_1.Patch)(':id/toggle-ai'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('aiEnabled')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "toggleAi", null);
__decorate([
    (0, common_1.Patch)(':id/assign'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('staffId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "assign", null);
exports.ConversationController = ConversationController = __decorate([
    (0, common_1.Controller)('admin/v1/conversations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(2, (0, bullmq_1.InjectQueue)(queue_constants_1.QUEUE_SEND_MESSAGE)),
    __metadata("design:paramtypes", [conversation_service_1.ConversationService,
        message_service_1.MessageService,
        bullmq_2.Queue])
], ConversationController);
//# sourceMappingURL=conversation.controller.js.map