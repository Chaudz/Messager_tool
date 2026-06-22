import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConversationStatus, Intent, Prisma, Message } from '@prisma/client';
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

const TEST_REPLY_MESSAGE =
  'Dạ em nhận tin của anh/chị rồi ạ! Bên em đang test hệ thống, anh/chị chờ em chút nha 🥰';

const DEFAULT_GREETING_REPLY =
  'Dạ em chào anh/chị! Em có thể hỗ trợ anh/chị về menu, đặt bàn, giờ mở cửa ạ 😊 Anh/chị cần em giúp gì nha?';

@Injectable()
export class AiOrchestratorService {
  private readonly logger = new Logger(AiOrchestratorService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly settingsService: SettingsService,
    private readonly conversationRepo: ConversationRepository,
    private readonly messageService: MessageService,
    private readonly intentDetection: IntentDetectionService,
    private readonly contextBuilder: ContextBuilderService,
    private readonly responseGeneration: ResponseGenerationService,
    private readonly reservationService: ReservationService,
    private readonly handoffService: HandoffService,
    private readonly aiLogRepo: AiLogRepository,
  ) {}

  async process(params: {
    conversationId: string;
    messageId: string;
    customerMessage: string;
    customerId: string;
    customerName?: string;
  }): Promise<AiProcessResult> {
    // TODO: tắt khi bật lại OpenAI — set AI_TEST_MODE=false trong .env
    if (this.config.get<string>('AI_TEST_MODE', 'false') === 'true') {
      return this.processTestReply(params);
    }

    const settings = await this.settingsService.get();
    const conversation = await this.conversationRepo.findById(params.conversationId);

    if (!settings.aiEnabled || !conversation?.aiEnabled) {
      const text = await this.handoffService.trigger(params.conversationId);
      const msg = await this.messageService.createOutboundAiMessage({
        conversationId: params.conversationId,
        content: text,
        intent: Intent.HUMAN_HANDOFF,
        intentConfidence: 100,
      });
      return {
        responseText: text,
        intent: Intent.HUMAN_HANDOFF,
        confidence: 100,
        handoff: true,
        outboundMessageId: msg.id,
      };
    }

    const history = await this.messageService.getRecentHistory(params.conversationId, 8);
    const historyText = history
      .reverse()
      .map((m: Message) => `${m.senderType}: ${m.content}`)
      .slice(0, -1);

    const intentResult = await this.intentDetection.detect(
      params.customerMessage,
      historyText,
    );

    const threshold = Number(settings.confidenceThreshold);

    if (intentResult.intent === Intent.HUMAN_HANDOFF) {
      const text = await this.handoffService.trigger(params.conversationId);
      await this.logAi(params, intentResult, {}, text);
      const msg = await this.messageService.createOutboundAiMessage({
        conversationId: params.conversationId,
        content: text,
        intent: Intent.HUMAN_HANDOFF,
        intentConfidence: intentResult.confidence,
      });
      return {
        responseText: text,
        intent: Intent.HUMAN_HANDOFF,
        confidence: intentResult.confidence,
        handoff: true,
        outboundMessageId: msg.id,
      };
    }

    if (
      intentResult.intent === Intent.UNKNOWN ||
      intentResult.intent === Intent.GREETING
    ) {
      await this.logAi(
        params,
        intentResult,
        { greeting: true },
        DEFAULT_GREETING_REPLY,
      );
      const msg = await this.messageService.createOutboundAiMessage({
        conversationId: params.conversationId,
        content: DEFAULT_GREETING_REPLY,
        intent: intentResult.intent,
        intentConfidence: intentResult.confidence,
      });
      return {
        responseText: DEFAULT_GREETING_REPLY,
        intent: intentResult.intent,
        confidence: intentResult.confidence,
        handoff: false,
        outboundMessageId: msg.id,
      };
    }

    if (intentResult.confidence < threshold) {
      const text = await this.handoffService.trigger(params.conversationId);
      await this.logAi(params, intentResult, {}, text);
      const msg = await this.messageService.createOutboundAiMessage({
        conversationId: params.conversationId,
        content: text,
        intent: Intent.HUMAN_HANDOFF,
        intentConfidence: intentResult.confidence,
      });
      return {
        responseText: text,
        intent: Intent.HUMAN_HANDOFF,
        confidence: intentResult.confidence,
        handoff: true,
        outboundMessageId: msg.id,
      };
    }

    let responseText = '';
    let handoff = false;

    const reservationIntents: Intent[] = [
      Intent.RESERVATION_CREATE,
      Intent.RESERVATION_UPDATE,
      Intent.RESERVATION_CANCEL,
    ];

    if (reservationIntents.includes(intentResult.intent)) {
      const reservationResult = await this.reservationService.handleReservationFlow({
        conversationId: params.conversationId,
        customerId: params.customerId,
        customerName: params.customerName,
        slots: {
          partySize: intentResult.entities.partySize,
          reservationTime: intentResult.entities.reservationTime,
          reservationDate: intentResult.entities.reservationDate,
          customerPhone: intentResult.entities.customerPhone,
        },
        intent: intentResult.intent as
          | 'RESERVATION_CREATE'
          | 'RESERVATION_UPDATE'
          | 'RESERVATION_CANCEL',
      });
      responseText = reservationResult.response;
    } else {
      const context = await this.contextBuilder.build(
        intentResult.intent,
        intentResult.entities.keyword,
      );

      if (context.isEmpty && context.requiresData) {
        responseText = await this.handoffService.trigger(params.conversationId);
        handoff = true;
      } else {
        const directFaq = this.responseGeneration.getFaqDirectAnswer(
          intentResult.intent,
          context.text,
        );
        if (directFaq) {
          responseText = directFaq.startsWith('Dạ') ? directFaq : `Dạ ${directFaq}`;
        } else {
          const generated = await this.responseGeneration.generate({
            userMessage: params.customerMessage,
            context: context.text,
            history: historyText,
          });
          responseText = generated.response;
          intentResult.usage.promptTokens += generated.usage.promptTokens;
          intentResult.usage.completionTokens += generated.usage.completionTokens;
          intentResult.usage.totalTokens += generated.usage.totalTokens;

          if (responseText.includes('chuyển nhân viên')) {
            await this.handoffService.trigger(params.conversationId);
            handoff = true;
          }
        }
      }
    }

    await this.logAi(params, intentResult, { responseText }, responseText);

    const msg = await this.messageService.createOutboundAiMessage({
      conversationId: params.conversationId,
      content: responseText,
      intent: intentResult.intent,
      intentConfidence: intentResult.confidence,
    });

    await this.conversationRepo.setIntent(
      params.conversationId,
      intentResult.intent,
    );

    this.logger.log(
      `AI processed message ${params.messageId}: intent=${intentResult.intent}, handoff=${handoff}`,
    );

    return {
      responseText,
      intent: intentResult.intent,
      confidence: intentResult.confidence,
      handoff,
      outboundMessageId: msg.id,
    };
  }

  /** Trả lời cố định để test pipeline, không gọi OpenAI */
  private async processTestReply(params: {
    conversationId: string;
    messageId: string;
  }): Promise<AiProcessResult> {
    await this.conversationRepo.update(params.conversationId, {
      status: ConversationStatus.ACTIVE,
    });

    const msg = await this.messageService.createOutboundAiMessage({
      conversationId: params.conversationId,
      content: TEST_REPLY_MESSAGE,
      intent: Intent.GREETING,
      intentConfidence: 100,
    });

    this.logger.log(`Test mode: replying to conversation ${params.conversationId}`);

    return {
      responseText: TEST_REPLY_MESSAGE,
      intent: Intent.GREETING,
      confidence: 100,
      handoff: false,
      outboundMessageId: msg.id,
    };
  }

  private async logAi(
    params: { conversationId: string; messageId: string },
    intentResult: Awaited<ReturnType<IntentDetectionService['detect']>>,
    contextUsed: Record<string, unknown>,
    responseText: string,
  ) {
    const settings = await this.settingsService.get();
    await this.aiLogRepo.create({
      conversation: { connect: { id: params.conversationId } },
      message: { connect: { id: params.messageId } },
      promptTokens: intentResult.usage.promptTokens,
      completionTokens: intentResult.usage.completionTokens,
      totalTokens: intentResult.usage.totalTokens,
      model: settings.aiModel,
      intentDetected: intentResult.intent,
      confidence: intentResult.confidence,
      contextUsed: contextUsed as Prisma.InputJsonValue,
      rawResponse: responseText,
      latencyMs: intentResult.latencyMs,
    });
  }
}
