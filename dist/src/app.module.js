"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./infrastructure/prisma/prisma.module");
const redis_module_1 = require("./infrastructure/redis/redis.module");
const facebook_module_1 = require("./infrastructure/facebook/facebook.module");
const openai_module_1 = require("./infrastructure/openai/openai.module");
const queue_module_1 = require("./queues/queue.module");
const workers_module_1 = require("./workers/workers.module");
const webhook_module_1 = require("./modules/webhook/webhook.module");
const auth_module_1 = require("./modules/auth/auth.module");
const conversation_module_1 = require("./modules/conversation/conversation.module");
const menu_module_1 = require("./modules/menu/menu.module");
const faq_module_1 = require("./modules/faq/faq.module");
const reservation_module_1 = require("./modules/reservation/reservation.module");
const settings_module_1 = require("./modules/settings/settings.module");
const ai_module_1 = require("./modules/ai/ai.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule,
            redis_module_1.RedisModule,
            facebook_module_1.FacebookModule,
            openai_module_1.OpenAiModule,
            queue_module_1.QueueModule,
            workers_module_1.WorkersModule,
            webhook_module_1.WebhookModule,
            auth_module_1.AuthModule,
            conversation_module_1.ConversationModule,
            menu_module_1.MenuModule,
            faq_module_1.FaqModule,
            reservation_module_1.ReservationModule,
            settings_module_1.SettingsModule,
            ai_module_1.AiModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map