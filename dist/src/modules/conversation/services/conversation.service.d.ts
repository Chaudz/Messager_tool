import { ConversationStatus } from '@prisma/client';
import { ConversationRepository } from '../repositories/conversation.repository';
export declare class ConversationService {
    private readonly conversationRepo;
    constructor(conversationRepo: ConversationRepository);
    getOrCreateActiveConversation(customerId: string, facebookThreadId?: string): Promise<{
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
    }>;
    findById(id: string): import("@prisma/client").Prisma.Prisma__ConversationClient<({
        customer: {
            id: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            facebookPsid: string;
        };
        messages: {
            id: string;
            createdAt: Date;
            conversationId: string;
            facebookMessageId: string | null;
            direction: import("@prisma/client").$Enums.MessageDirection;
            senderType: import("@prisma/client").$Enums.SenderType;
            content: string;
            intent: import("@prisma/client").$Enums.Intent | null;
            intentConfidence: import("@prisma/client/runtime/library").Decimal | null;
            metadataJson: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
    } & {
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
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findMany(page: number, limit: number, status?: ConversationStatus): Promise<[({
        customer: {
            id: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            facebookPsid: string;
        };
        messages: {
            id: string;
            createdAt: Date;
            conversationId: string;
            facebookMessageId: string | null;
            direction: import("@prisma/client").$Enums.MessageDirection;
            senderType: import("@prisma/client").$Enums.SenderType;
            content: string;
            intent: import("@prisma/client").$Enums.Intent | null;
            intentConfidence: import("@prisma/client/runtime/library").Decimal | null;
            metadataJson: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
    } & {
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
    })[], number]>;
    assignStaff(id: string, staffId: string): Promise<{
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
    }>;
    close(id: string): import("@prisma/client").Prisma.Prisma__ConversationClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    toggleAi(id: string, aiEnabled: boolean): import("@prisma/client").Prisma.Prisma__ConversationClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    markWaitingHuman(id: string): import("@prisma/client").Prisma.Prisma__ConversationClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    reactivateIfWaitingHuman(id: string): import("@prisma/client").Prisma.Prisma__ConversationClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    touchLastMessage(id: string): import("@prisma/client").Prisma.Prisma__ConversationClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
