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
var IntentDetectionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntentDetectionService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const openai_service_1 = require("../../../infrastructure/openai/openai.service");
const settings_service_1 = require("../../settings/services/settings.service");
const system_prompt_1 = require("../prompts/system.prompt");
const VALID_INTENTS = new Set(Object.values(client_1.Intent));
let IntentDetectionService = IntentDetectionService_1 = class IntentDetectionService {
    openAi;
    settingsService;
    logger = new common_1.Logger(IntentDetectionService_1.name);
    constructor(openAi, settingsService) {
        this.openAi = openAi;
        this.settingsService = settingsService;
    }
    async detect(message, history) {
        const settings = await this.settingsService.get();
        const historyText = history.length
            ? `Lịch sử:\n${history.join('\n')}\n\n`
            : '';
        if (!this.openAi.isConfigured()) {
            return this.fallbackDetect(message);
        }
        try {
            const result = await this.openAi.chatJson(settings.aiModel, system_prompt_1.INTENT_DETECTION_PROMPT, `${historyText}Tin nhắn mới: "${message}"`, 0.1);
            const intent = VALID_INTENTS.has(result.data.intent)
                ? result.data.intent
                : client_1.Intent.UNKNOWN;
            this.logger.log(`Intent detected: ${intent}, confidence=${result.data.confidence}`);
            return {
                intent,
                confidence: result.data.confidence ?? 0,
                entities: result.data.entities ?? {},
                usage: result.usage,
                latencyMs: result.latencyMs,
                rawResponse: result.rawResponse,
            };
        }
        catch (error) {
            this.logger.error(`Intent detection failed: ${error}`);
            return this.fallbackDetect(message);
        }
    }
    fallbackDetect(message) {
        const lower = message.toLowerCase();
        let intent = client_1.Intent.UNKNOWN;
        let confidence = 50;
        if (/mở cửa|giờ|mấy giờ/.test(lower)) {
            intent = client_1.Intent.FAQ_OPENING_HOURS;
            confidence = 90;
        }
        else if (/địa chỉ|ở đâu/.test(lower)) {
            intent = client_1.Intent.FAQ_ADDRESS;
            confidence = 90;
        }
        else if (/số điện thoại|hotline|gọi/.test(lower)) {
            intent = client_1.Intent.FAQ_PHONE;
            confidence = 90;
        }
        else if (/đặt bàn|còn bàn|giữ bàn/.test(lower)) {
            intent = client_1.Intent.RESERVATION_CREATE;
            confidence = 90;
        }
        else if (/hủy bàn|hủy đặt/.test(lower)) {
            intent = client_1.Intent.RESERVATION_CANCEL;
            confidence = 90;
        }
        else if (/giá|bao nhiêu/.test(lower)) {
            intent = client_1.Intent.MENU_PRICE;
            confidence = 85;
        }
        else if (/còn không|còn hay không/.test(lower)) {
            intent = client_1.Intent.MENU_AVAILABILITY;
            confidence = 85;
        }
        else if (/menu|món|hải sản|tôm|cua|ốc/.test(lower)) {
            intent = client_1.Intent.MENU_INQUIRY;
            confidence = 85;
        }
        else if (/tiệc|đoàn|báo giá/.test(lower)) {
            intent = client_1.Intent.HUMAN_HANDOFF;
            confidence = 95;
        }
        else if (/xin chào|hello|hi|chào/.test(lower)) {
            intent = client_1.Intent.GREETING;
            confidence = 90;
        }
        else if (message.trim().length <= 20) {
            intent = client_1.Intent.GREETING;
            confidence = 85;
        }
        return {
            intent,
            confidence,
            entities: {},
            usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
            latencyMs: 0,
            rawResponse: 'fallback',
        };
    }
};
exports.IntentDetectionService = IntentDetectionService;
exports.IntentDetectionService = IntentDetectionService = IntentDetectionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [openai_service_1.OpenAiService,
        settings_service_1.SettingsService])
], IntentDetectionService);
//# sourceMappingURL=intent-detection.service.js.map