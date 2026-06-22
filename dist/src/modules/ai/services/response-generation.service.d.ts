import { Intent } from '@prisma/client';
import { OpenAiService } from '../../../infrastructure/openai/openai.service';
import { SettingsService } from '../../settings/services/settings.service';
export declare class ResponseGenerationService {
    private readonly openAi;
    private readonly settingsService;
    private readonly logger;
    constructor(openAi: OpenAiService, settingsService: SettingsService);
    generate(params: {
        userMessage: string;
        context: string;
        history: string[];
    }): Promise<{
        response: string;
        usage: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        };
        latencyMs: number;
        rawResponse: string;
    }>;
    getFaqDirectAnswer(intent: Intent, context: string): string | null;
    private fallbackResponse;
}
