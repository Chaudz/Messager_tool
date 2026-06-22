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
var ContextBuilderService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextBuilderService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const faq_service_1 = require("../../faq/services/faq.service");
const menu_service_1 = require("../../menu/services/menu.service");
const settings_service_1 = require("../../settings/services/settings.service");
let ContextBuilderService = ContextBuilderService_1 = class ContextBuilderService {
    settingsService;
    menuService;
    faqService;
    logger = new common_1.Logger(ContextBuilderService_1.name);
    constructor(settingsService, menuService, faqService) {
        this.settingsService = settingsService;
        this.menuService = menuService;
        this.faqService = faqService;
    }
    async build(intent, keyword) {
        const settings = await this.settingsService.get();
        const requiresData = !['GREETING', 'HUMAN_HANDOFF', 'UNKNOWN'].includes(intent);
        let contextParts = [
            `Tên nhà hàng: ${settings.restaurantName}`,
            `Địa chỉ: ${settings.address}`,
            `SĐT: ${settings.phone}`,
            `Giờ mở cửa:\n${this.settingsService.formatOpeningHours(settings.openingHours)}`,
        ];
        switch (intent) {
            case client_1.Intent.FAQ_OPENING_HOURS: {
                const faq = await this.faqService.findByCategory(client_1.FaqCategory.OPENING_HOURS);
                if (faq)
                    contextParts.push(`FAQ: ${faq.answer}`);
                break;
            }
            case client_1.Intent.FAQ_ADDRESS: {
                const faq = await this.faqService.findByCategory(client_1.FaqCategory.ADDRESS);
                if (faq)
                    contextParts.push(`FAQ: ${faq.answer}`);
                break;
            }
            case client_1.Intent.FAQ_PHONE: {
                const faq = await this.faqService.findByCategory(client_1.FaqCategory.PHONE);
                if (faq)
                    contextParts.push(`FAQ: ${faq.answer}`);
                break;
            }
            case client_1.Intent.MENU_INQUIRY:
            case client_1.Intent.MENU_PRICE:
            case client_1.Intent.MENU_AVAILABILITY:
            case client_1.Intent.GENERAL_AI: {
                const items = await this.menuService.search(keyword);
                const menuText = this.menuService.formatMenuForContext(items);
                if (menuText)
                    contextParts.push(`MENU:\n${menuText}`);
                const faqs = await this.faqService.findAll();
                const faqText = this.faqService.formatFaqsForContext(faqs);
                if (faqText)
                    contextParts.push(`FAQ:\n${faqText}`);
                break;
            }
            default:
                break;
        }
        const text = contextParts.join('\n\n');
        const isEmpty = requiresData &&
            ['MENU_INQUIRY', 'MENU_PRICE', 'MENU_AVAILABILITY', 'GENERAL_AI'].includes(intent) &&
            !text.includes('MENU:');
        this.logger.debug(`Built context for intent ${intent}, empty=${isEmpty}`);
        return { text, isEmpty, requiresData };
    }
};
exports.ContextBuilderService = ContextBuilderService;
exports.ContextBuilderService = ContextBuilderService = ContextBuilderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [settings_service_1.SettingsService,
        menu_service_1.MenuService,
        faq_service_1.FaqService])
], ContextBuilderService);
//# sourceMappingURL=context-builder.service.js.map