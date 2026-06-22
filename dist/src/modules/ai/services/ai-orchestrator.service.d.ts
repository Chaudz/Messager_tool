import { ConfigService } from '@nestjs/config';
import { Intent } from '@prisma/client';
import { ConversationRepository } from '../../conversation/repositories/conversation.repository';
import { MessageService } from '../../message/services/message.service';
import { ReservationService } from '../../reservation/services/reservation.service';
import { SettingsService } from '../../settings/services/settings.service';
import { AiLogRepository } from '../repositories/ai-log.repository';
import { ContextBuilderService } from './context-builder.service';
import { HandoffService } from './handoff.service';
import { IntentDetectionService } from './intent-detection.service';
import { ResponseGenerationService } from './response-generation.service';
export interface AiProcessResult {
    responseText: string;
    intent: Intent;
    confidence: number;
    handoff: boolean;
    outboundMessageId: string;
}
export declare class AiOrchestratorService {
    private readonly config;
    private readonly settingsService;
    private readonly conversationRepo;
    private readonly messageService;
    private readonly intentDetection;
    private readonly contextBuilder;
    private readonly responseGeneration;
    private readonly reservationService;
    private readonly handoffService;
    private readonly aiLogRepo;
    private readonly logger;
    constructor(config: ConfigService, settingsService: SettingsService, conversationRepo: ConversationRepository, messageService: MessageService, intentDetection: IntentDetectionService, contextBuilder: ContextBuilderService, responseGeneration: ResponseGenerationService, reservationService: ReservationService, handoffService: HandoffService, aiLogRepo: AiLogRepository);
    process(params: {
        conversationId: string;
        messageId: string;
        customerMessage: string;
        customerId: string;
        customerName?: string;
    }): Promise<AiProcessResult>;
    private processTestReply;
    private logAi;
}
