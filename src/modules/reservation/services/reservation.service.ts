import { Injectable, Logger } from '@nestjs/common';
import { ReservationStatus, Prisma } from '@prisma/client';
import { ReservationRepository } from '../repositories/reservation.repository';
import { ConversationRepository } from '../../conversation/repositories/conversation.repository';

export interface ReservationSlots {
  partySize?: number;
  reservationDate?: string;
  reservationTime?: string;
  customerName?: string;
  customerPhone?: string;
}

@Injectable()
export class ReservationService {
  private readonly logger = new Logger(ReservationService.name);

  constructor(
    private readonly reservationRepo: ReservationRepository,
    private readonly conversationRepo: ConversationRepository,
  ) {}

  findMany(page: number, limit: number, status?: string, date?: string) {
    return this.reservationRepo.findMany({ page, limit, status, date });
  }

  findById(id: string) {
    return this.reservationRepo.findById(id);
  }

  updateStatus(id: string, status: ReservationStatus) {
    return this.reservationRepo.update(id, { status });
  }

  async handleReservationFlow(params: {
    conversationId: string;
    customerId: string;
    customerName?: string;
    slots: ReservationSlots;
    intent: 'RESERVATION_CREATE' | 'RESERVATION_UPDATE' | 'RESERVATION_CANCEL';
  }): Promise<{ response: string; completed: boolean }> {
    const { conversationId, customerId, customerName, slots, intent } = params;

    if (intent === 'RESERVATION_CANCEL') {
      const active = await this.reservationRepo.findActiveByCustomer(customerId);
      if (!active) {
        return {
          response:
            'Dạ em chưa thấy đặt bàn nào của anh/chị ạ. Anh/chị cho em biết thêm chi tiết được không ạ?',
          completed: true,
        };
      }
      await this.reservationRepo.update(active.id, { status: 'CANCELLED' });
      await this.conversationRepo.update(conversationId, {
        contextJson: Prisma.DbNull,
      });
      return {
        response: 'Dạ em đã hủy đặt bàn giúp anh/chị rồi ạ 😊',
        completed: true,
      };
    }

    const context = (await this.conversationRepo.findById(conversationId))
      ?.contextJson as { slots?: ReservationSlots } | null;
    const merged: ReservationSlots = { ...context?.slots, ...slots };

    if (!merged.partySize) {
      await this.saveContext(conversationId, merged);
      return {
        response:
          'Dạ tối nay bên em vẫn còn bàn anh/chị nha 🥰 Anh/chị đi khoảng mấy người để em giữ bàn cho mình ạ?',
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
        response:
          'Dạ anh/chị cho em xin số điện thoại để em xác nhận đặt bàn nha 📞',
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
      contextJson: Prisma.DbNull,
    });

    this.logger.log(`Reservation confirmed for customer ${customerId}`);
    return {
      response: `Dạ em xác nhận đặt bàn ${merged.partySize} người lúc ${merged.reservationTime} ngày ${reservationDate.toLocaleDateString('vi-VN')} cho anh/chị rồi ạ 🥰 Hẹn gặp anh/chị tại Nhà hàng Đại Hằng nha!`,
      completed: true,
    };
  }

  private async saveContext(conversationId: string, slots: ReservationSlots) {
    await this.conversationRepo.update(conversationId, {
      contextJson: {
        intent: 'RESERVATION_CREATE',
        slots: slots as Prisma.InputJsonValue,
      } as Prisma.InputJsonValue,
    });
  }
}
