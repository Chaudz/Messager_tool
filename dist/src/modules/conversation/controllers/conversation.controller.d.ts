import { ConversationStatus } from '@prisma/client';
import { ApiResponse } from '../../../common/utils/api-response';
import { ConversationService } from '../services/conversation.service';
import { ReplyConversationDto } from '../dtos/reply-conversation.dto';
import { MessageService } from '../../message/services/message.service';
import { Queue } from 'bullmq';
export declare class ConversationController {
    private readonly conversationService;
    private readonly messageService;
    private readonly sendQueue;
    constructor(conversationService: ConversationService, messageService: MessageService, sendQueue: Queue);
    list(page?: string, limit?: string, status?: ConversationStatus): Promise<ApiResponse<({
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
    }) | null>>;
    reply(id: string, dto: ReplyConversationDto): Promise<ApiResponse<null> | ApiResponse<{
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
    }>>;
    close(id: string): Promise<ApiResponse<{
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
    }>>;
    toggleAi(id: string, aiEnabled: boolean): Promise<ApiResponse<{
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
    }>>;
    assign(id: string, staffId: string): Promise<ApiResponse<{
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
    }>>;
}
