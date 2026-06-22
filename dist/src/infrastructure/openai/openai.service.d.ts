import { ConfigService } from '@nestjs/config';
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
export declare class OpenAiService {
    private readonly config;
    private readonly logger;
    private readonly client;
    constructor(config: ConfigService);
    isConfigured(): boolean;
    chatJson<T>(model: string, systemPrompt: string, userPrompt: string, temperature?: number): Promise<OpenAiResult<T>>;
    chatText(model: string, systemPrompt: string, userPrompt: string, temperature?: number): Promise<OpenAiResult<string>>;
}
