import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

export interface SendMessagePayload {
  recipientPsid: string;
  text: string;
}

@Injectable()
export class FacebookService {
  private readonly logger = new Logger(FacebookService.name);
  private readonly client: AxiosInstance;
  private readonly pageAccessToken: string;

  constructor(private readonly config: ConfigService) {
    this.pageAccessToken = this.config.get<string>(
      'FACEBOOK_PAGE_ACCESS_TOKEN',
      '',
    );
    this.client = axios.create({
      baseURL: 'https://graph.facebook.com/v21.0',
      timeout: 15000,
    });
  }

  verifySignature(rawBody: Buffer, signature: string | undefined): boolean {
    const appSecret = this.config.get<string>('FACEBOOK_APP_SECRET');
    if (!appSecret || !signature) return false;

    const crypto = require('crypto') as typeof import('crypto');
    const expected =
      'sha256=' +
      crypto.createHmac('sha256', appSecret).update(rawBody).digest('hex');
    return expected === signature;
  }

  async sendTextMessage(payload: SendMessagePayload): Promise<void> {
    if (!this.pageAccessToken) {
      this.logger.warn('FACEBOOK_PAGE_ACCESS_TOKEN not set, skipping send');
      return;
    }

    try {
      await this.client.post(
        '/me/messages',
        {
          recipient: { id: payload.recipientPsid },
          message: { text: payload.text },
          messaging_type: 'RESPONSE',
        },
        { params: { access_token: this.pageAccessToken } },
      );
      this.logger.log(`Sent message to PSID ${payload.recipientPsid}`);
    } catch (error) {
      const detail =
        axios.isAxiosError(error) && error.response?.data
          ? JSON.stringify(error.response.data)
          : error instanceof Error
            ? error.message
            : String(error);
      this.logger.error(`Facebook Send API error: ${detail}`);
      throw error;
    }
  }

  async getUserProfile(psid: string): Promise<{ name?: string }> {
    if (!this.pageAccessToken) return {};
    try {
      const { data } = await this.client.get(`/${psid}`, {
        params: {
          fields: 'first_name,last_name',
          access_token: this.pageAccessToken,
        },
      });
      const name = [data.first_name, data.last_name].filter(Boolean).join(' ');
      return { name: name || undefined };
    } catch {
      return {};
    }
  }
}
