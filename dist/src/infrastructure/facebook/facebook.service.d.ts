import { ConfigService } from '@nestjs/config';
export interface SendMessagePayload {
    recipientPsid: string;
    text: string;
}
export declare class FacebookService {
    private readonly config;
    private readonly logger;
    private readonly client;
    private readonly pageAccessToken;
    constructor(config: ConfigService);
    verifySignature(rawBody: Buffer, signature: string | undefined): boolean;
    sendTextMessage(payload: SendMessagePayload): Promise<void>;
    getUserProfile(psid: string): Promise<{
        name?: string;
    }>;
}
