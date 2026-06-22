"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkersModule = void 0;
const common_1 = require("@nestjs/common");
const queue_module_1 = require("../queues/queue.module");
const customer_module_1 = require("../modules/customer/customer.module");
const conversation_module_1 = require("../modules/conversation/conversation.module");
const message_module_1 = require("../modules/message/message.module");
const ai_module_1 = require("../modules/ai/ai.module");
const spam_module_1 = require("../modules/spam/spam.module");
const incoming_message_processor_1 = require("./incoming-message.processor");
const ai_processing_processor_1 = require("./ai-processing.processor");
const send_message_processor_1 = require("./send-message.processor");
let WorkersModule = class WorkersModule {
};
exports.WorkersModule = WorkersModule;
exports.WorkersModule = WorkersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            queue_module_1.QueueModule,
            customer_module_1.CustomerModule,
            conversation_module_1.ConversationModule,
            message_module_1.MessageModule,
            ai_module_1.AiModule,
            spam_module_1.SpamModule,
        ],
        providers: [
            incoming_message_processor_1.IncomingMessageProcessor,
            ai_processing_processor_1.AiProcessingProcessor,
            send_message_processor_1.SendMessageProcessor,
        ],
    })
], WorkersModule);
//# sourceMappingURL=workers.module.js.map