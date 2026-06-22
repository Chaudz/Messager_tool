import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
export declare class ReservationRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.ReservationCreateInput): Prisma.Prisma__ReservationClient<{
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
    findMany(params: {
        page: number;
        limit: number;
        status?: string;
        date?: string;
    }): Promise<[({
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
    update(id: string, data: Prisma.ReservationUpdateInput): Prisma.Prisma__ReservationClient<{
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
    findActiveByCustomer(customerId: string): Prisma.Prisma__ReservationClient<{
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
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
}
