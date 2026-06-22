import { Message, Prisma } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
export declare class MessageRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByFacebookMessageId(facebookMessageId: string): Promise<Message | null>;
    create(data: Prisma.MessageCreateInput): Promise<Message>;
    findRecentByConversation(conversationId: string, take?: number): Prisma.PrismaPromise<{
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
