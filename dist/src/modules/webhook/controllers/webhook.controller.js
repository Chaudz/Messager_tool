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
exports.WebhookController = void 0;
const common_1 = require("@nestjs/common");
const webhook_service_1 = require("../services/webhook.service");
const facebook_service_1 = require("../../../infrastructure/facebook/facebook.service");
let WebhookController = class WebhookController {
    webhookService;
    facebookService;
    constructor(webhookService, facebookService) {
        this.webhookService = webhookService;
        this.facebookService = facebookService;
    }
    verify(mode, token, challenge, res) {
        const result = this.webhookService.verifyWebhook(mode, token, challenge);
        if (result) {
            return res.status(common_1.HttpStatus.OK).send(result);
        }
        return res.sendStatus(common_1.HttpStatus.FORBIDDEN);
    }
    async receive(req, res) {
        const signature = req.headers['x-hub-signature-256'];
        const rawBody = req.rawBody;
        if (rawBody && !this.facebookService.verifySignature(rawBody, signature)) {
            return res.sendStatus(common_1.HttpStatus.FORBIDDEN);
        }
        await this.webhookService.handleWebhookPayload(req.body);
        return res.sendStatus(common_1.HttpStatus.OK);
    }
};
exports.WebhookController = WebhookController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('hub.mode')),
    __param(1, (0, common_1.Query)('hub.verify_token')),
    __param(2, (0, common_1.Query)('hub.challenge')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", void 0)
], WebhookController.prototype, "verify", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WebhookController.prototype, "receive", null);
exports.WebhookController = WebhookController = __decorate([
    (0, common_1.Controller)('webhook/facebook'),
    __metadata("design:paramtypes", [webhook_service_1.WebhookService,
        facebook_service_1.FacebookService])
], WebhookController);
//# sourceMappingURL=webhook.controller.js.map