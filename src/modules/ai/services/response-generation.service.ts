import { Injectable, Logger } from '@nestjs/common';
import { Intent } from '@prisma/client';
import { OpenAiService } from '../../../infrastructure/openai/openai.service';
import { SettingsService } from '../../settings/services/settings.service';
import { HANDOFF_MESSAGE, SYSTEM_PROMPT_BASE } from '../prompts/system.prompt';

@Injectable()
export class ResponseGenerationService {
  private readonly logger = new Logger(ResponseGenerationService.name);

  constructor(
    private readonly openAi: OpenAiService,
    private readonly settingsService: SettingsService,
  ) {}

  async generate(params: {
    userMessage: string;
    context: string;
    history: string[];
  }): Promise<{
    response: string;
    usage: { promptTokens: number; completionTokens: number; totalTokens: number };
    latencyMs: number;
    rawResponse: string;
  }> {
    const settings = await this.settingsService.get();

    if (!params.context.trim()) {
      return {
        response: HANDOFF_MESSAGE,
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
        latencyMs: 0,
        rawResponse: 'empty-context',
      };
    }

    if (!this.openAi.isConfigured()) {
      return {
        response: this.fallbackResponse(params.userMessage, params.context),
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
        latencyMs: 0,
        rawResponse: 'fallback',
      };
    }

    const systemPrompt = `${SYSTEM_PROMPT_BASE}\n${settings.systemPrompt}`;
    const historyText = params.history.length
      ? `Lịch sử hội thoại:\n${params.history.join('\n')}\n\n`
      : '';

    const userPrompt = `${historyText}CONTEXT (chỉ dùng dữ liệu này):\n${params.context}\n\nKhách hỏi: "${params.userMessage}"\n\nTrả lời ngắn gọn theo phong cách chủ quán. Trả JSON: { "response": "..." }`;

    try {
      const result = await this.openAi.chatJson<{ response: string }>(
        settings.aiModel,
        systemPrompt,
        userPrompt,
        0.7,
      );

      const response = result.data.response?.trim() || HANDOFF_MESSAGE;
      this.logger.log(`AI response generated (${result.usage.totalTokens} tokens)`);

      return {
        response,
        usage: result.usage,
        latencyMs: result.latencyMs,
        rawResponse: result.rawResponse,
      };
    } catch (error) {
      this.logger.error(`Response generation failed: ${error}`);
      return {
        response: this.fallbackResponse(params.userMessage, params.context),
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
        latencyMs: 0,
        rawResponse: 'error-fallback',
      };
    }
  }

  getFaqDirectAnswer(intent: Intent, context: string): string | null {
    const faqIntents: Intent[] = [
      Intent.FAQ_OPENING_HOURS,
      Intent.FAQ_ADDRESS,
      Intent.FAQ_PHONE,
    ];
    if (faqIntents.includes(intent)) {
      const faqMatch = context.match(/FAQ: (.+)/);
      if (faqMatch) return faqMatch[1];
    }
    return null;
  }

  private fallbackResponse(userMessage: string, context: string): string {
    const lower = userMessage.toLowerCase();
    if (/mở cửa|giờ|nhận đơn/.test(lower)) {
      const match = context.match(/Giờ nhận đơn:\n([\s\S]*?)(\n\n|$)/);
      if (match) return `Dạ bên em nhận đơn theo lịch:\n${match[1]}`.trim();
    }
    if (/địa chỉ|ở đâu|giao hàng/.test(lower)) {
      const match = context.match(/Địa chỉ \/ giao hàng: (.+)/);
      if (match) return `Dạ bên em ${match[1]} ạ.`;
    }
    if (/menu|món|cá|chả|hành|tỏi/.test(lower) && context.includes('MENU:')) {
      const menuPart = context.split('MENU:')[1]?.split('\n\n')[0];
      if (menuPart) return `Dạ bên em có:\n${menuPart.trim()} 🐟`;
    }
    return HANDOFF_MESSAGE;
  }
}
