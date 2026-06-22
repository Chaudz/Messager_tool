import { Module } from '@nestjs/common';
import { AiLogRepository } from './repositories/ai-log.repository';
import { AiLogController } from './controllers/ai-log.controller';
import { ContextBuilderService } from './services/context-builder.service';
import { IntentDetectionService } from './services/intent-detection.service';
import { ResponseGenerationService } from './services/response-generation.service';
import { HandoffService } from './services/handoff.service';
import { AiOrchestratorService } from './services/ai-orchestrator.service';
import { SettingsModule } from '../settings/settings.module';
import { MenuModule } from '../menu/menu.module';
import { FaqModule } from '../faq/faq.module';
import { ConversationModule } from '../conversation/conversation.module';
import { MessageModule } from '../message/message.module';
import { ReservationModule } from '../reservation/reservation.module';

@Module({
  imports: [
    SettingsModule,
    MenuModule,
    FaqModule,
    ConversationModule,
    MessageModule,
    ReservationModule,
  ],
  controllers: [AiLogController],
  providers: [
    AiLogRepository,
    ContextBuilderService,
    IntentDetectionService,
    ResponseGenerationService,
    HandoffService,
    AiOrchestratorService,
  ],
  exports: [AiOrchestratorService, AiLogRepository],
})
export class AiModule {}
