import type { RawBodyRequest } from '@nestjs/common';
import type { Request, Response } from 'express';
import { WebhookService } from '../services/webhook.service';
import { FacebookService } from '../../../infrastructure/facebook/facebook.service';
export declare class WebhookController {
    private readonly webhookService;
    private readonly facebookService;
    constructor(webhookService: WebhookService, facebookService: FacebookService);
    verify(mode: string, token: string, challenge: string, res: Response): Response<any, Record<string, any>>;
    receive(req: RawBodyRequest<Request>, res: Response): Promise<Response<any, Record<string, any>>>;
}
