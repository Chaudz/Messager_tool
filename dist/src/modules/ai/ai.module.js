"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiModule = void 0;
const common_1 = require("@nestjs/common");
const ai_log_repository_1 = require("./repositories/ai-log.repository");
const ai_log_controller_1 = require("./controllers/ai-log.controller");
const context_builder_service_1 = require("./services/context-builder.service");
const intent_detection_service_1 = require("./services/intent-detection.service");
const response_generation_service_1 = require("./services/response-generation.service");
const handoff_service_1 = require("./services/handoff.service");
const ai_orchestrator_service_1 = require("./services/ai-orchestrator.service");
const settings_module_1 = require("../settings/settings.module");
const menu_module_1 = require("../menu/menu.module");
const faq_module_1 = require("../faq/faq.module");
const conversation_module_1 = require("../conversation/conversation.module");
const message_module_1 = require("../message/message.module");
const reservation_module_1 = require("../reservation/reservation.module");
let AiModule = class AiModule {
};
exports.AiModule = AiModule;
exports.AiModule = AiModule = __decorate([
    (0, common_1.Module)({
        imports: [
            settings_module_1.SettingsModule,
            menu_module_1.MenuModule,
            faq_module_1.FaqModule,
            conversation_module_1.ConversationModule,
            message_module_1.MessageModule,
            reservation_module_1.ReservationModule,
        ],
        controllers: [ai_log_controller_1.AiLogController],
        providers: [
            ai_log_repository_1.AiLogRepository,
            context_builder_service_1.ContextBuilderService,
            intent_detection_service_1.IntentDetectionService,
            response_generation_service_1.ResponseGenerationService,
            handoff_service_1.HandoffService,
            ai_orchestrator_service_1.AiOrchestratorService,
        ],
        exports: [ai_orchestrator_service_1.AiOrchestratorService, ai_log_repository_1.AiLogRepository],
    })
], AiModule);
//# sourceMappingURL=ai.module.js.map