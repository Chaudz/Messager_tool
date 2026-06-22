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
var FacebookService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacebookService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
let FacebookService = FacebookService_1 = class FacebookService {
    config;
    logger = new common_1.Logger(FacebookService_1.name);
    client;
    pageAccessToken;
    constructor(config) {
        this.config = config;
        this.pageAccessToken = this.config.get('FACEBOOK_PAGE_ACCESS_TOKEN', '');
        this.client = axios_1.default.create({
            baseURL: 'https://graph.facebook.com/v21.0',
            timeout: 15000,
        });
    }
    verifySignature(rawBody, signature) {
        const appSecret = this.config.get('FACEBOOK_APP_SECRET');
        if (!appSecret || !signature)
            return false;
        const crypto = require('crypto');
        const expected = 'sha256=' +
            crypto.createHmac('sha256', appSecret).update(rawBody).digest('hex');
        return expected === signature;
    }
    async sendTextMessage(payload) {
        if (!this.pageAccessToken) {
            this.logger.warn('FACEBOOK_PAGE_ACCESS_TOKEN not set, skipping send');
            return;
        }
        try {
            await this.client.post('/me/messages', {
                recipient: { id: payload.recipientPsid },
                message: { text: payload.text },
                messaging_type: 'RESPONSE',
            }, { params: { access_token: this.pageAccessToken } });
            this.logger.log(`Sent message to PSID ${payload.recipientPsid}`);
        }
        catch (error) {
            const detail = axios_1.default.isAxiosError(error) && error.response?.data
                ? JSON.stringify(error.response.data)
                : error instanceof Error
                    ? error.message
                    : String(error);
            this.logger.error(`Facebook Send API error: ${detail}`);
            throw error;
        }
    }
    async getUserProfile(psid) {
        if (!this.pageAccessToken)
            return {};
        try {
            const { data } = await this.client.get(`/${psid}`, {
                params: {
                    fields: 'first_name,last_name',
                    access_token: this.pageAccessToken,
                },
            });
            const name = [data.first_name, data.last_name].filter(Boolean).join(' ');
            return { name: name || undefined };
        }
        catch {
            return {};
        }
    }
};
exports.FacebookService = FacebookService;
exports.FacebookService = FacebookService = FacebookService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FacebookService);
//# sourceMappingURL=facebook.service.js.map