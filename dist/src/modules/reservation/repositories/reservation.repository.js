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
exports.ReservationRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../infrastructure/prisma/prisma.service");
let ReservationRepository = class ReservationRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(data) {
        return this.prisma.reservation.create({ data });
    }
    findById(id) {
        return this.prisma.reservation.findUnique({
            where: { id },
            include: { customer: true, conversation: true },
        });
    }
    findMany(params) {
        const where = {};
        if (params.status)
            where.status = params.status;
        if (params.date)
            where.reservationDate = new Date(params.date);
        return this.prisma.$transaction([
            this.prisma.reservation.findMany({
                where,
                include: { customer: true },
                orderBy: [{ reservationDate: 'asc' }, { reservationTime: 'asc' }],
                skip: (params.page - 1) * params.limit,
                take: params.limit,
            }),
            this.prisma.reservation.count({ where }),
        ]);
    }
    update(id, data) {
        return this.prisma.reservation.update({ where: { id }, data });
    }
    findActiveByCustomer(customerId) {
        return this.prisma.reservation.findFirst({
            where: {
                customerId,
                status: { in: ['PENDING', 'CONFIRMED'] },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.ReservationRepository = ReservationRepository;
exports.ReservationRepository = ReservationRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReservationRepository);
//# sourceMappingURL=reservation.repository.js.map