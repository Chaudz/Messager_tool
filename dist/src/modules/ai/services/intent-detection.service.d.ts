import { Intent } from '@prisma/client';
import { OpenAiService } from '../../../infrastructure/openai/openai.service';
import { SettingsService } from '../../settings/services/settings.service';
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
    usage: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    latencyMs: number;
    rawResponse: string;
}
export declare class IntentDetectionService {
    private readonly openAi;
    private readonly settingsService;
    private readonly logger;
    constructor(openAi: OpenAiService, settingsService: SettingsService);
    detect(message: string, history: string[]): Promise<IntentResult>;
    private fallbackDetect;
}
