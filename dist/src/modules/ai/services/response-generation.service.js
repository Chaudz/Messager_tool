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
var ResponseGenerationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseGenerationService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const openai_service_1 = require("../../../infrastructure/openai/openai.service");
const settings_service_1 = require("../../settings/services/settings.service");
const system_prompt_1 = require("../prompts/system.prompt");
let ResponseGenerationService = ResponseGenerationService_1 = class ResponseGenerationService {
    openAi;
    settingsService;
    logger = new common_1.Logger(ResponseGenerationService_1.name);
    constructor(openAi, settingsService) {
        this.openAi = openAi;
        this.settingsService = settingsService;
    }
    async generate(params) {
        const settings = await this.settingsService.get();
        if (!params.context.trim()) {
            return {
                response: system_prompt_1.HANDOFF_MESSAGE,
                usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
                latencyMs: 0,
                rawResponse: 'empty-context',
            };
        }
        if (!this.openAi.isConfigured()) {
            return {
                response: this.fallbackResponse(params.userMessage, params.context),
                usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
                latencyMs: 0,
                rawResponse: 'fallback',
            };
        }
        const systemPrompt = `${system_prompt_1.SYSTEM_PROMPT_BASE}\n${settings.systemPrompt}`;
        const historyText = params.history.length
            ? `Lịch sử hội thoại:\n${params.history.join('\n')}\n\n`
            : '';
        const userPrompt = `${historyText}CONTEXT (chỉ dùng dữ liệu này):\n${params.context}\n\nKhách hỏi: "${params.userMessage}"\n\nTrả lời ngắn gọn theo phong cách chủ quán. Trả JSON: { "response": "..." }`;
        try {
            const result = await this.openAi.chatJson(settings.aiModel, systemPrompt, userPrompt, 0.7);
            const response = result.data.response?.trim() || system_prompt_1.HANDOFF_MESSAGE;
            this.logger.log(`AI response generated (${result.usage.totalTokens} tokens)`);
            return {
                response,
                usage: result.usage,
                latencyMs: result.latencyMs,
                rawResponse: result.rawResponse,
            };
        }
        catch (error) {
            this.logger.error(`Response generation failed: ${error}`);
            return {
                response: this.fallbackResponse(params.userMessage, params.context),
                usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
                latencyMs: 0,
                rawResponse: 'error-fallback',
            };
        }
    }
    getFaqDirectAnswer(intent, context) {
        const faqIntents = [
            client_1.Intent.FAQ_OPENING_HOURS,
            client_1.Intent.FAQ_ADDRESS,
            client_1.Intent.FAQ_PHONE,
        ];
        if (faqIntents.includes(intent)) {
            const faqMatch = context.match(/FAQ: (.+)/);
            if (faqMatch)
                return faqMatch[1];
        }
        return null;
    }
    fallbackResponse(userMessage, context) {
        const lower = userMessage.toLowerCase();
        if (/mở cửa|giờ/.test(lower)) {
            const match = context.match(/Giờ mở cửa:\n([\s\S]*?)(\n\n|$)/);
            if (match)
                return `Dạ bên em mở cửa theo lịch:\n${match[1]}`.trim();
        }
        if (/địa chỉ|ở đâu/.test(lower)) {
            const match = context.match(/Địa chỉ: (.+)/);
            if (match)
                return `Dạ nhà hàng em ở ${match[1]} ạ.`;
        }
        if (/menu|món/.test(lower) && context.includes('MENU:')) {
            const menuPart = context.split('MENU:')[1]?.split('\n\n')[0];
            if (menuPart)
                return `Dạ bên em có các món:\n${menuPart.trim()} 🦐`;
        }
        return system_prompt_1.HANDOFF_MESSAGE;
    }
};
exports.ResponseGenerationService = ResponseGenerationService;
exports.ResponseGenerationService = ResponseGenerationService = ResponseGenerationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [openai_service_1.OpenAiService,
        settings_service_1.SettingsService])
], ResponseGenerationService);
//# sourceMappingURL=response-generation.service.js.map