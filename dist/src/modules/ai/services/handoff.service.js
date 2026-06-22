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
var HandoffService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandoffService = void 0;
const common_1 = require("@nestjs/common");
const conversation_service_1 = require("../../conversation/services/conversation.service");
const system_prompt_1 = require("../prompts/system.prompt");
let HandoffService = HandoffService_1 = class HandoffService {
    conversationService;
    logger = new common_1.Logger(HandoffService_1.name);
    constructor(conversationService) {
        this.conversationService = conversationService;
    }
    async trigger(conversationId) {
        await this.conversationService.markWaitingHuman(conversationId);
        this.logger.log(`Human handoff triggered for conversation ${conversationId}`);
        return system_prompt_1.HANDOFF_MESSAGE;
    }
};
exports.HandoffService = HandoffService;
exports.HandoffService = HandoffService = HandoffService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [conversation_service_1.ConversationService])
], HandoffService);
//# sourceMappingURL=handoff.service.js.map