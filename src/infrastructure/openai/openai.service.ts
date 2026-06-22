import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

export interface OpenAiUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface OpenAiResult<T> {
  data: T;
  usage: OpenAiUsage;
  rawResponse: string;
  latencyMs: number;
}

@Injectable()
export class OpenAiService {
  private readonly logger = new Logger(OpenAiService.name);
  private readonly client: OpenAI | null;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('OPENAI_API_KEY');
    this.client = apiKey ? new OpenAI({ apiKey }) : null;
  }

  isConfigured(): boolean {
    return this.client !== null;
  }

  async chatJson<T>(
    model: string,
    systemPrompt: string,
    userPrompt: string,
    temperature = 0.2,
  ): Promise<OpenAiResult<T>> {
    if (!this.client) {
      throw new Error('OpenAI API key not configured');
    }

    const start = Date.now();
    const response = await this.client.chat.completions.create({
      model,
      temperature,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });

    const content = response.choices[0]?.message?.content ?? '{}';
    const latencyMs = Date.now() - start;

    this.logger.log(
      `OpenAI tokens: prompt=${response.usage?.prompt_tokens}, completion=${response.usage?.completion_tokens}`,
    );

    return {
      data: JSON.parse(content) as T,
      usage: {
        promptTokens: response.usage?.prompt_tokens ?? 0,
        completionTokens: response.usage?.completion_tokens ?? 0,
        totalTokens: response.usage?.total_tokens ?? 0,
      },
      rawResponse: content,
      latencyMs,
    };
  }

  async chatText(
    model: string,
    systemPrompt: string,
    userPrompt: string,
    temperature = 0.7,
  ): Promise<OpenAiResult<string>> {
    if (!this.client) {
      throw new Error('OpenAI API key not configured');
    }

    const start = Date.now();
    const response = await this.client.chat.completions.create({
      model,
      temperature,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });

    const content = response.choices[0]?.message?.content ?? '';
    const latencyMs = Date.now() - start;

    return {
      data: content,
      usage: {
        promptTokens: response.usage?.prompt_tokens ?? 0,
        completionTokens: response.usage?.completion_tokens ?? 0,
        totalTokens: response.usage?.total_tokens ?? 0,
      },
      rawResponse: content,
      latencyMs,
    };
  }
}
