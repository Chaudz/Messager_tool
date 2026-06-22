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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var OpenAiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = __importDefault(require("openai"));
let OpenAiService = OpenAiService_1 = class OpenAiService {
    config;
    logger = new common_1.Logger(OpenAiService_1.name);
    client;
    constructor(config) {
        this.config = config;
        const apiKey = this.config.get('OPENAI_API_KEY');
        this.client = apiKey ? new openai_1.default({ apiKey }) : null;
    }
    isConfigured() {
        return this.client !== null;
    }
    async chatJson(model, systemPrompt, userPrompt, temperature = 0.2) {
        if (!this.client) {
            throw new Error('OpenAI API key not configured');
        }
        const start = Date.now();
        const response = await this.client.chat.completions.create({
            model,
            temperature,
            response_format: { type: 'json_object' },
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
        });
        const content = response.choices[0]?.message?.content ?? '{}';
        const latencyMs = Date.now() - start;
        this.logger.log(`OpenAI tokens: prompt=${response.usage?.prompt_tokens}, completion=${response.usage?.completion_tokens}`);
        return {
            data: JSON.parse(content),
            usage: {
                promptTokens: response.usage?.prompt_tokens ?? 0,
                completionTokens: response.usage?.completion_tokens ?? 0,
                totalTokens: response.usage?.total_tokens ?? 0,
            },
            rawResponse: content,
            latencyMs,
        };
    }
    async chatText(model, systemPrompt, userPrompt, temperature = 0.7) {
        if (!this.client) {
            throw new Error('OpenAI API key not configured');
        }
        const start = Date.now();
        const response = await this.client.chat.completions.create({
            model,
            temperature,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
        });
        const content = response.choices[0]?.message?.content ?? '';
        const latencyMs = Date.now() - start;
        return {
            data: content,
            usage: {
                promptTokens: response.usage?.prompt_tokens ?? 0,
                completionTokens: response.usage?.completion_tokens ?? 0,
                totalTokens: response.usage?.total_tokens ?? 0,
            },
            rawResponse: content,
            latencyMs,
        };
    }
};
exports.OpenAiService = OpenAiService;
exports.OpenAiService = OpenAiService = OpenAiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], OpenAiService);
//# sourceMappingURL=openai.service.js.map