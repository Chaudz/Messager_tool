import { ReservationStatus } from '@prisma/client';
import { ApiResponse } from '../../../common/utils/api-response';
import { ReservationService } from '../services/reservation.service';
export declare class ReservationController {
    private readonly reservationService;
    constructor(reservationService: ReservationService);
    list(page?: string, limit?: string, status?: string, date?: string): Promise<ApiResponse<({
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
    })[]>>;
    detail(id: string): Promise<ApiResponse<({
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
            contextJson: import("@prisma/client/runtime/library").JsonValue | null;
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
    }) | null>>;
    updateStatus(id: string, status: ReservationStatus): Promise<ApiResponse<{
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
    }>>;
}
