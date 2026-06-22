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
var ReservationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const reservation_repository_1 = require("../repositories/reservation.repository");
const conversation_repository_1 = require("../../conversation/repositories/conversation.repository");
let ReservationService = ReservationService_1 = class ReservationService {
    reservationRepo;
    conversationRepo;
    logger = new common_1.Logger(ReservationService_1.name);
    constructor(reservationRepo, conversationRepo) {
        this.reservationRepo = reservationRepo;
        this.conversationRepo = conversationRepo;
    }
    findMany(page, limit, status, date) {
        return this.reservationRepo.findMany({ page, limit, status, date });
    }
    findById(id) {
        return this.reservationRepo.findById(id);
    }
    updateStatus(id, status) {
        return this.reservationRepo.update(id, { status });
    }
    async handleReservationFlow(params) {
        const { conversationId, customerId, customerName, slots, intent } = params;
        if (intent === 'RESERVATION_CANCEL') {
            const active = await this.reservationRepo.findActiveByCustomer(customerId);
            if (!active) {
                return {
                    response: 'Dạ em chưa thấy đặt bàn nào của anh/chị ạ. Anh/chị cho em biết thêm chi tiết được không ạ?',
                    completed: true,
                };
            }
            await this.reservationRepo.update(active.id, { status: 'CANCELLED' });
            await this.conversationRepo.update(conversationId, {
                contextJson: client_1.Prisma.DbNull,
            });
            return {
                response: 'Dạ em đã hủy đặt bàn giúp anh/chị rồi ạ 😊',
                completed: true,
            };
        }
        const context = (await this.conversationRepo.findById(conversationId))
            ?.contextJson;
        const merged = { ...context?.slots, ...slots };
        if (!merged.partySize) {
            await this.saveContext(conversationId, merged);
            return {
                response: 'Dạ tối nay bên em vẫn còn bàn anh/chị nha 🥰 Anh/chị đi khoảng mấy người để em giữ bàn cho mình ạ?',
                completed: false,
            };
        }
        if (!merged.reservationTime) {
            await this.saveContext(conversationId, merged);
            return {
                response: `Dạ ${merged.partySize} người ạ. Anh/chị đi lúc mấy giờ để em giữ bàn cho mình ạ?`,
                completed: false,
            };
        }
        if (!merged.customerPhone) {
            await this.saveContext(conversationId, merged);
            return {
                response: 'Dạ anh/chị cho em xin số điện thoại để em xác nhận đặt bàn nha 📞',
                completed: false,
            };
        }
        const reservationDate = merged.reservationDate
            ? new Date(merged.reservationDate)
            : new Date();
        await this.reservationRepo.create({
            customer: { connect: { id: customerId } },
            conversation: { connect: { id: conversationId } },
            customerName: merged.customerName ?? customerName ?? 'Khách',
            customerPhone: merged.customerPhone,
            partySize: merged.partySize,
            reservationDate,
            reservationTime: merged.reservationTime,
            status: 'CONFIRMED',
        });
        await this.conversationRepo.update(conversationId, {
            contextJson: client_1.Prisma.DbNull,
        });
        this.logger.log(`Reservation confirmed for customer ${customerId}`);
        return {
            response: `Dạ em xác nhận đặt bàn ${merged.partySize} người lúc ${merged.reservationTime} ngày ${reservationDate.toLocaleDateString('vi-VN')} cho anh/chị rồi ạ 🥰 Hẹn gặp anh/chị tại Nhà hàng Đại Hằng nha!`,
            completed: true,
        };
    }
    async saveContext(conversationId, slots) {
        await this.conversationRepo.update(conversationId, {
            contextJson: {
                intent: 'RESERVATION_CREATE',
                slots: slots,
            },
        });
    }
};
exports.ReservationService = ReservationService;
exports.ReservationService = ReservationService = ReservationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [reservation_repository_1.ReservationRepository,
        conversation_repository_1.ConversationRepository])
], ReservationService);
//# sourceMappingURL=reservation.service.js.map