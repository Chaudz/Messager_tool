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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const conversation_repository_1 = require("../repositories/conversation.repository");
let ConversationService = class ConversationService {
    conversationRepo;
    constructor(conversationRepo) {
        this.conversationRepo = conversationRepo;
    }
    async getOrCreateActiveConversation(customerId, facebookThreadId) {
        const existing = await this.conversationRepo.findActiveByCustomerId(customerId);
        if (existing)
            return existing;
        return this.conversationRepo.create({
            customer: { connect: { id: customerId } },
            facebookThreadId,
            status: 'ACTIVE',
            lastMessageAt: new Date(),
        });
    }
    findById(id) {
        return this.conversationRepo.findById(id);
    }
    findMany(page, limit, status) {
        return this.conversationRepo.findMany({ page, limit, status });
    }
    async assignStaff(id, staffId) {
        return this.conversationRepo.update(id, {
            assignedStaffId: staffId,
            status: client_1.ConversationStatus.WAITING_HUMAN,
        });
    }
    close(id) {
        return this.conversationRepo.update(id, { status: client_1.ConversationStatus.CLOSED });
    }
    toggleAi(id, aiEnabled) {
        return this.conversationRepo.update(id, { aiEnabled });
    }
    markWaitingHuman(id) {
        return this.conversationRepo.update(id, {
            status: client_1.ConversationStatus.WAITING_HUMAN,
        });
    }
    reactivateIfWaitingHuman(id) {
        return this.conversationRepo.update(id, {
            status: client_1.ConversationStatus.ACTIVE,
            assignedStaffId: null,
        });
    }
    touchLastMessage(id) {
        return this.conversationRepo.update(id, { lastMessageAt: new Date() });
    }
};
exports.ConversationService = ConversationService;
exports.ConversationService = ConversationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [conversation_repository_1.ConversationRepository])
], ConversationService);
//# sourceMappingURL=conversation.service.js.map