import { Intent, Prisma, Message } from '@prisma/client';
import { MessageRepository } from '../repositories/message.repository';
import { ConversationService } from '../../conversation/services/conversation.service';
export declare class MessageService {
    private readonly messageRepo;
    private readonly conversationService;
    private readonly logger;
    constructor(messageRepo: MessageRepository, conversationService: ConversationService);
    createInboundMessage(params: {
        conversationId: string;
        facebookMessageId: string;
        content: string;
        metadataJson?: Record<string, unknown>;
    }): Promise<{
        message: Message;
        isDuplicate: boolean;
    }>;
    createOutboundAiMessage(params: {
        conversationId: string;
        content: string;
        intent?: Intent;
        intentConfidence?: number;
    }): Promise<{
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
    }>;
    createOutboundStaffMessage(conversationId: string, content: string): Promise<{
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
    }>;
    createSystemMessage(conversationId: string, content: string): Promise<{
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
    }>;
    getRecentHistory(conversationId: string, take?: number): Prisma.PrismaPromise<{
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
    }[]>;
}
