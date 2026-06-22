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
exports.AiLogController = void 0;
const common_1 = require("@nestjs/common");
const api_response_1 = require("../../../common/utils/api-response");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const ai_log_repository_1 = require("../repositories/ai-log.repository");
let AiLogController = class AiLogController {
    aiLogRepo;
    constructor(aiLogRepo) {
        this.aiLogRepo = aiLogRepo;
    }
    async list(page = '1', limit = '20', conversationId) {
        const [items, total] = await this.aiLogRepo.findMany(Number(page), Number(limit), conversationId);
        return api_response_1.ApiResponse.ok(items, {
            page: Number(page),
            limit: Number(limit),
            total,
        });
    }
    async stats() {
        const stats = await this.aiLogRepo.getStats();
        return api_response_1.ApiResponse.ok(stats);
    }
};
exports.AiLogController = AiLogController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('conversationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], AiLogController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AiLogController.prototype, "stats", null);
exports.AiLogController = AiLogController = __decorate([
    (0, common_1.Controller)('admin/v1/ai-logs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [ai_log_repository_1.AiLogRepository])
], AiLogController);
//# sourceMappingURL=ai-log.controller.js.map