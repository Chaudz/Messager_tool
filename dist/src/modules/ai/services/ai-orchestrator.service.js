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
var AiOrchestratorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiOrchestratorService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const conversation_repository_1 = require("../../conversation/repositories/conversation.repository");
const message_service_1 = require("../../message/services/message.service");
const reservation_service_1 = require("../../reservation/services/reservation.service");
const settings_service_1 = require("../../settings/services/settings.service");
const ai_log_repository_1 = require("../repositories/ai-log.repository");
const context_builder_service_1 = require("./context-builder.service");
const handoff_service_1 = require("./handoff.service");
const intent_detection_service_1 = require("./intent-detection.service");
const response_generation_service_1 = require("./response-generation.service");
const TEST_REPLY_MESSAGE = 'Dạ em nhận tin của anh/chị rồi ạ! Bên em đang test hệ thống, anh/chị chờ em chút nha 🥰';
const DEFAULT_GREETING_REPLY = 'Dạ em chào anh/chị! Em có thể hỗ trợ anh/chị về menu, đặt bàn, giờ mở cửa ạ 😊 Anh/chị cần em giúp gì nha?';
let AiOrchestratorService = AiOrchestratorService_1 = class AiOrchestratorService {
    config;
    settingsService;
    conversationRepo;
    messageService;
    intentDetection;
    contextBuilder;
    responseGeneration;
    reservationService;
    handoffService;
    aiLogRepo;
    logger = new common_1.Logger(AiOrchestratorService_1.name);
    constructor(config, settingsService, conversationRepo, messageService, intentDetection, contextBuilder, responseGeneration, reservationService, handoffService, aiLogRepo) {
        this.config = config;
        this.settingsService = settingsService;
        this.conversationRepo = conversationRepo;
        this.messageService = messageService;
        this.intentDetection = intentDetection;
        this.contextBuilder = contextBuilder;
        this.responseGeneration = responseGeneration;
        this.reservationService = reservationService;
        this.handoffService = handoffService;
        this.aiLogRepo = aiLogRepo;
    }
    async process(params) {
        if (this.config.get('AI_TEST_MODE', 'false') === 'true') {
            return this.processTestReply(params);
        }
        const settings = await this.settingsService.get();
        const conversation = await this.conversationRepo.findById(params.conversationId);
        if (!settings.aiEnabled || !conversation?.aiEnabled) {
            const text = await this.handoffService.trigger(params.conversationId);
            const msg = await this.messageService.createOutboundAiMessage({
                conversationId: params.conversationId,
                content: text,
                intent: client_1.Intent.HUMAN_HANDOFF,
                intentConfidence: 100,
            });
            return {
                responseText: text,
                intent: client_1.Intent.HUMAN_HANDOFF,
                confidence: 100,
                handoff: true,
                outboundMessageId: msg.id,
            };
        }
        const history = await this.messageService.getRecentHistory(params.conversationId, 8);
        const historyText = history
            .reverse()
            .map((m) => `${m.senderType}: ${m.content}`)
            .slice(0, -1);
        const intentResult = await this.intentDetection.detect(params.customerMessage, historyText);
        const threshold = Number(settings.confidenceThreshold);
        if (intentResult.intent === client_1.Intent.HUMAN_HANDOFF) {
            const text = await this.handoffService.trigger(params.conversationId);
            await this.logAi(params, intentResult, {}, text);
            const msg = await this.messageService.createOutboundAiMessage({
                conversationId: params.conversationId,
                content: text,
                intent: client_1.Intent.HUMAN_HANDOFF,
                intentConfidence: intentResult.confidence,
            });
            return {
                responseText: text,
                intent: client_1.Intent.HUMAN_HANDOFF,
                confidence: intentResult.confidence,
                handoff: true,
                outboundMessageId: msg.id,
            };
        }
        if (intentResult.intent === client_1.Intent.UNKNOWN ||
            intentResult.intent === client_1.Intent.GREETING) {
            await this.logAi(params, intentResult, { greeting: true }, DEFAULT_GREETING_REPLY);
            const msg = await this.messageService.createOutboundAiMessage({
                conversationId: params.conversationId,
                content: DEFAULT_GREETING_REPLY,
                intent: intentResult.intent,
                intentConfidence: intentResult.confidence,
            });
            return {
                responseText: DEFAULT_GREETING_REPLY,
                intent: intentResult.intent,
                confidence: intentResult.confidence,
                handoff: false,
                outboundMessageId: msg.id,
            };
        }
        if (intentResult.confidence < threshold) {
            const text = await this.handoffService.trigger(params.conversationId);
            await this.logAi(params, intentResult, {}, text);
            const msg = await this.messageService.createOutboundAiMessage({
                conversationId: params.conversationId,
                content: text,
                intent: client_1.Intent.HUMAN_HANDOFF,
                intentConfidence: intentResult.confidence,
            });
            return {
                responseText: text,
                intent: client_1.Intent.HUMAN_HANDOFF,
                confidence: intentResult.confidence,
                handoff: true,
                outboundMessageId: msg.id,
            };
        }
        let responseText = '';
        let handoff = false;
        const reservationIntents = [
            client_1.Intent.RESERVATION_CREATE,
            client_1.Intent.RESERVATION_UPDATE,
            client_1.Intent.RESERVATION_CANCEL,
        ];
        if (reservationIntents.includes(intentResult.intent)) {
            const reservationResult = await this.reservationService.handleReservationFlow({
                conversationId: params.conversationId,
                customerId: params.customerId,
                customerName: params.customerName,
                slots: {
                    partySize: intentResult.entities.partySize,
                    reservationTime: intentResult.entities.reservationTime,
                    reservationDate: intentResult.entities.reservationDate,
                    customerPhone: intentResult.entities.customerPhone,
                },
                intent: intentResult.intent,
            });
            responseText = reservationResult.response;
        }
        else {
            const context = await this.contextBuilder.build(intentResult.intent, intentResult.entities.keyword);
            if (context.isEmpty && context.requiresData) {
                responseText = await this.handoffService.trigger(params.conversationId);
                handoff = true;
            }
            else {
                const directFaq = this.responseGeneration.getFaqDirectAnswer(intentResult.intent, context.text);
                if (directFaq) {
                    responseText = directFaq.startsWith('Dạ') ? directFaq : `Dạ ${directFaq}`;
                }
                else {
                    const generated = await this.responseGeneration.generate({
                        userMessage: params.customerMessage,
                        context: context.text,
                        history: historyText,
                    });
                    responseText = generated.response;
                    intentResult.usage.promptTokens += generated.usage.promptTokens;
                    intentResult.usage.completionTokens += generated.usage.completionTokens;
                    intentResult.usage.totalTokens += generated.usage.totalTokens;
                    if (responseText.includes('chuyển nhân viên')) {
                        await this.handoffService.trigger(params.conversationId);
                        handoff = true;
                    }
                }
            }
        }
        await this.logAi(params, intentResult, { responseText }, responseText);
        const msg = await this.messageService.createOutboundAiMessage({
            conversationId: params.conversationId,
            content: responseText,
            intent: intentResult.intent,
            intentConfidence: intentResult.confidence,
        });
        await this.conversationRepo.setIntent(params.conversationId, intentResult.intent);
        this.logger.log(`AI processed message ${params.messageId}: intent=${intentResult.intent}, handoff=${handoff}`);
        return {
            responseText,
            intent: intentResult.intent,
            confidence: intentResult.confidence,
            handoff,
            outboundMessageId: msg.id,
        };
    }
    async processTestReply(params) {
        await this.conversationRepo.update(params.conversationId, {
            status: client_1.ConversationStatus.ACTIVE,
        });
        const msg = await this.messageService.createOutboundAiMessage({
            conversationId: params.conversationId,
            content: TEST_REPLY_MESSAGE,
            intent: client_1.Intent.GREETING,
            intentConfidence: 100,
        });
        this.logger.log(`Test mode: replying to conversation ${params.conversationId}`);
        return {
            responseText: TEST_REPLY_MESSAGE,
            intent: client_1.Intent.GREETING,
            confidence: 100,
            handoff: false,
            outboundMessageId: msg.id,
        };
    }
    async logAi(params, intentResult, contextUsed, responseText) {
        const settings = await this.settingsService.get();
        await this.aiLogRepo.create({
            conversation: { connect: { id: params.conversationId } },
            message: { connect: { id: params.messageId } },
            promptTokens: intentResult.usage.promptTokens,
            completionTokens: intentResult.usage.completionTokens,
            totalTokens: intentResult.usage.totalTokens,
            model: settings.aiModel,
            intentDetected: intentResult.intent,
            confidence: intentResult.confidence,
            contextUsed: contextUsed,
            rawResponse: responseText,
            latencyMs: intentResult.latencyMs,
        });
    }
};
exports.AiOrchestratorService = AiOrchestratorService;
exports.AiOrchestratorService = AiOrchestratorService = AiOrchestratorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        settings_service_1.SettingsService,
        conversation_repository_1.ConversationRepository,
        message_service_1.MessageService,
        intent_detection_service_1.IntentDetectionService,
        context_builder_service_1.ContextBuilderService,
        response_generation_service_1.ResponseGenerationService,
        reservation_service_1.ReservationService,
        handoff_service_1.HandoffService,
        ai_log_repository_1.AiLogRepository])
], AiOrchestratorService);
//# sourceMappingURL=ai-orchestrator.service.js.map