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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../../infrastructure/prisma/prisma.service");
let ConversationRepository = class ConversationRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findById(id) {
        return this.prisma.conversation.findUnique({
            where: { id },
            include: {
                customer: true,
                messages: { orderBy: { createdAt: 'asc' }, take: 50 },
            },
        });
    }
    findActiveByCustomerId(customerId) {
        return this.prisma.conversation.findFirst({
            where: {
                customerId,
                status: { in: [client_1.ConversationStatus.ACTIVE, client_1.ConversationStatus.WAITING_HUMAN] },
            },
            orderBy: { lastMessageAt: 'desc' },
        });
    }
    create(data) {
        return this.prisma.conversation.create({ data });
    }
    update(id, data) {
        return this.prisma.conversation.update({ where: { id }, data });
    }
    findMany(params) {
        const { page, limit, status } = params;
        const where = status ? { status } : {};
        return this.prisma.$transaction([
            this.prisma.conversation.findMany({
                where,
                include: { customer: true, messages: { take: 1, orderBy: { createdAt: 'desc' } } },
                orderBy: { lastMessageAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.conversation.count({ where }),
        ]);
    }
    setIntent(id, intent, contextJson) {
        return this.prisma.conversation.update({
            where: { id },
            data: {
                currentIntent: intent,
                ...(contextJson !== undefined ? { contextJson } : {}),
            },
        });
    }
};
exports.ConversationRepository = ConversationRepository;
exports.ConversationRepository = ConversationRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ConversationRepository);
//# sourceMappingURL=conversation.repository.js.map