import { Injectable, Logger } from '@nestjs/common';
import { Intent } from '@prisma/client';
import { OpenAiService } from '../../../infrastructure/openai/openai.service';
import { SettingsService } from '../../settings/services/settings.service';
import { INTENT_DETECTION_PROMPT } from '../prompts/system.prompt';

export interface IntentResult {
  intent: Intent;
  confidence: number;
  entities: {
    keyword?: string;
    partySize?: number;
    reservationTime?: string;
    reservationDate?: string;
    customerPhone?: string;
  };
  usage: { promptTokens: number; completionTokens: number; totalTokens: number };
  latencyMs: number;
  rawResponse: string;
}

interface IntentDetectionResponse {
  intent: string;
  confidence: number;
  entities?: IntentResult['entities'];
}

const VALID_INTENTS = new Set<string>(Object.values(Intent));

@Injectable()
export class IntentDetectionService {
  private readonly logger = new Logger(IntentDetectionService.name);

  constructor(
    private readonly openAi: OpenAiService,
    private readonly settingsService: SettingsService,
  ) {}

  async detect(message: string, history: string[]): Promise<IntentResult> {
    const settings = await this.settingsService.get();
    const historyText = history.length
      ? `Lịch sử:\n${history.join('\n')}\n\n`
      : '';

    if (!this.openAi.isConfigured()) {
      return this.fallbackDetect(message);
    }

    try {
      const result = await this.openAi.chatJson<IntentDetectionResponse>(
        settings.aiModel,
        INTENT_DETECTION_PROMPT,
        `${historyText}Tin nhắn mới: "${message}"`,
        0.1,
      );

      const intent = VALID_INTENTS.has(result.data.intent)
        ? (result.data.intent as Intent)
        : Intent.UNKNOWN;

      this.logger.log(
        `Intent detected: ${intent}, confidence=${result.data.confidence}`,
      );

      return {
        intent,
        confidence: result.data.confidence ?? 0,
        entities: result.data.entities ?? {},
        usage: result.usage,
        latencyMs: result.latencyMs,
        rawResponse: result.rawResponse,
      };
    } catch (error) {
      this.logger.error(`Intent detection failed: ${error}`);
      return this.fallbackDetect(message);
    }
  }

  private fallbackDetect(message: string): IntentResult {
    const lower = message.toLowerCase();
    let intent: Intent = Intent.UNKNOWN;
    let confidence = 50;

    if (/mở cửa|giờ|mấy giờ/.test(lower)) {
      intent = Intent.FAQ_OPENING_HOURS;
      confidence = 90;
    } else if (/địa chỉ|ở đâu/.test(lower)) {
      intent = Intent.FAQ_ADDRESS;
      confidence = 90;
    } else if (/số điện thoại|hotline|gọi/.test(lower)) {
      intent = Intent.FAQ_PHONE;
      confidence = 90;
    } else if (/đặt bàn|còn bàn|giữ bàn/.test(lower)) {
      intent = Intent.RESERVATION_CREATE;
      confidence = 90;
    } else if (/hủy bàn|hủy đặt/.test(lower)) {
      intent = Intent.RESERVATION_CANCEL;
      confidence = 90;
    } else if (/giá|bao nhiêu/.test(lower)) {
      intent = Intent.MENU_PRICE;
      confidence = 85;
    } else if (/còn không|còn hay không/.test(lower)) {
      intent = Intent.MENU_AVAILABILITY;
      confidence = 85;
    } else if (/menu|món|hải sản|tôm|cua|ốc/.test(lower)) {
      intent = Intent.MENU_INQUIRY;
      confidence = 85;
    } else if (/tiệc|đoàn|báo giá/.test(lower)) {
      intent = Intent.HUMAN_HANDOFF;
      confidence = 95;
    } else if (/xin chào|hello|hi|chào/.test(lower)) {
      intent = Intent.GREETING;
      confidence = 90;
    } else if (message.trim().length <= 20) {
      // Tin ngắn / không rõ ý → chào hỏi, không handoff
      intent = Intent.GREETING;
      confidence = 85;
    }

    return {
      intent,
      confidence,
      entities: {},
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
      latencyMs: 0,
      rawResponse: 'fallback',
    };
  }
}
