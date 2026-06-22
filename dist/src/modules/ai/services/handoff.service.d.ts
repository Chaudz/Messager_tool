import { ConversationService } from '../../conversation/services/conversation.service';
export declare class HandoffService {
    private readonly conversationService;
    private readonly logger;
    constructor(conversationService: ConversationService);
    trigger(conversationId: string): Promise<string>;
}
