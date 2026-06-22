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
exports.FaqRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../infrastructure/prisma/prisma.service");
let FaqRepository = class FaqRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return this.prisma.faqItem.findMany({
            where: { isActive: true },
            orderBy: [{ sortOrder: 'asc' }],
        });
    }
    findByCategory(category) {
        return this.prisma.faqItem.findFirst({
            where: { category, isActive: true },
            orderBy: { sortOrder: 'asc' },
        });
    }
    findById(id) {
        return this.prisma.faqItem.findUnique({ where: { id } });
    }
    create(data) {
        return this.prisma.faqItem.create({ data });
    }
    update(id, data) {
        return this.prisma.faqItem.update({ where: { id }, data });
    }
    delete(id) {
        return this.prisma.faqItem.delete({ where: { id } });
    }
};
exports.FaqRepository = FaqRepository;
exports.FaqRepository = FaqRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FaqRepository);
//# sourceMappingURL=faq.repository.js.map