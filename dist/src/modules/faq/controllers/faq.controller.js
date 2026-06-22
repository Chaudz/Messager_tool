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
exports.FaqController = void 0;
const common_1 = require("@nestjs/common");
const api_response_1 = require("../../../common/utils/api-response");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const faq_service_1 = require("../services/faq.service");
const faq_dto_1 = require("../dtos/faq.dto");
let FaqController = class FaqController {
    faqService;
    constructor(faqService) {
        this.faqService = faqService;
    }
    async list() {
        return api_response_1.ApiResponse.ok(await this.faqService.findAll());
    }
    async create(dto) {
        const item = await this.faqService.create({
            ...dto,
            category: dto.category,
        });
        return api_response_1.ApiResponse.ok(item);
    }
    async update(id, dto) {
        const item = await this.faqService.update(id, dto);
        return api_response_1.ApiResponse.ok(item);
    }
    async remove(id) {
        await this.faqService.delete(id);
        return api_response_1.ApiResponse.ok({ deleted: true });
    }
};
exports.FaqController = FaqController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FaqController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [faq_dto_1.CreateFaqDto]),
    __metadata("design:returntype", Promise)
], FaqController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, faq_dto_1.UpdateFaqDto]),
    __metadata("design:returntype", Promise)
], FaqController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FaqController.prototype, "remove", null);
exports.FaqController = FaqController = __decorate([
    (0, common_1.Controller)('admin/v1/faq'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [faq_service_1.FaqService])
], FaqController);
//# sourceMappingURL=faq.controller.js.map