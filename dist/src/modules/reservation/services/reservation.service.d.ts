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
export declare class ReservationService {
    private readonly reservationRepo;
    private readonly conversationRepo;
    private readonly logger;
    constructor(reservationRepo: ReservationRepository, conversationRepo: ConversationRepository);
    findMany(page: number, limit: number, status?: string, date?: string): Promise<[({
        customer: {
            id: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            facebookPsid: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ReservationStatus;
        customerId: string;
        customerName: string;
        customerPhone: string;
        partySize: number;
        reservationDate: Date;
        reservationTime: string;
        notes: string | null;
        conversationId: string | null;
    })[], number]>;
    findById(id: string): Prisma.Prisma__ReservationClient<({
        customer: {
            id: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            facebookPsid: string;
        };
        conversation: {
            id: string;
            aiEnabled: boolean;
            createdAt: Date;
            updatedAt: Date;
            facebookThreadId: string | null;
            status: import("@prisma/client").$Enums.ConversationStatus;
            currentIntent: import("@prisma/client").$Enums.Intent | null;
            contextJson: Prisma.JsonValue | null;
            assignedStaffId: string | null;
            lastMessageAt: Date | null;
            customerId: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ReservationStatus;
        customerId: string;
        customerName: string;
        customerPhone: string;
        partySize: number;
        reservationDate: Date;
        reservationTime: string;
        notes: string | null;
        conversationId: string | null;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    updateStatus(id: string, status: ReservationStatus): Prisma.Prisma__ReservationClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ReservationStatus;
        customerId: string;
        customerName: string;
        customerPhone: string;
        partySize: number;
        reservationDate: Date;
        reservationTime: string;
        notes: string | null;
        conversationId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    handleReservationFlow(params: {
        conversationId: string;
        customerId: string;
        customerName?: string;
        slots: ReservationSlots;
        intent: 'RESERVATION_CREATE' | 'RESERVATION_UPDATE' | 'RESERVATION_CANCEL';
    }): Promise<{
        response: string;
        completed: boolean;
    }>;
    private saveContext;
}
