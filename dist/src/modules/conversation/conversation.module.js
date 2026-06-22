"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationModule = void 0;
const common_1 = require("@nestjs/common");
const conversation_repository_1 = require("./repositories/conversation.repository");
const conversation_service_1 = require("./services/conversation.service");
const conversation_controller_1 = require("./controllers/conversation.controller");
const customer_module_1 = require("../customer/customer.module");
const message_module_1 = require("../message/message.module");
const queue_module_1 = require("../../queues/queue.module");
let ConversationModule = class ConversationModule {
};
exports.ConversationModule = ConversationModule;
exports.ConversationModule = ConversationModule = __decorate([
    (0, common_1.Module)({
        imports: [customer_module_1.CustomerModule, (0, common_1.forwardRef)(() => message_module_1.MessageModule), queue_module_1.QueueModule],
        controllers: [conversation_controller_1.ConversationController],
        providers: [conversation_repository_1.ConversationRepository, conversation_service_1.ConversationService],
        exports: [conversation_repository_1.ConversationRepository, conversation_service_1.ConversationService],
    })
], ConversationModule);
//# sourceMappingURL=conversation.module.js.map