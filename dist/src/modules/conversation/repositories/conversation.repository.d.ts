import { Conversation, ConversationStatus, Intent, Prisma } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
export declare class ConversationRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Prisma.Prisma__ConversationClient<({
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
            intentConfidence: Prisma.Decimal | null;
            metadataJson: Prisma.JsonValue | null;
        }[];
    } & {
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
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    findActiveByCustomerId(customerId: string): Promise<Conversation | null>;
    create(data: Prisma.ConversationCreateInput): Promise<Conversation>;
    update(id: string, data: Prisma.ConversationUpdateInput): Prisma.Prisma__ConversationClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    findMany(params: {
        page: number;
        limit: number;
        status?: ConversationStatus;
    }): Promise<[({
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
            intentConfidence: Prisma.Decimal | null;
            metadataJson: Prisma.JsonValue | null;
        }[];
    } & {
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
    })[], number]>;
    setIntent(id: string, intent: Intent, contextJson?: Prisma.InputJsonValue): Prisma.Prisma__ConversationClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
}
