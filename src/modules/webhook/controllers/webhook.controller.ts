import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request, Response } from 'express';
import { WebhookService } from '../services/webhook.service';
import { FacebookService } from '../../../infrastructure/facebook/facebook.service';

@Controller('webhook/facebook')
export class WebhookController {
  constructor(
    private readonly webhookService: WebhookService,
    private readonly facebookService: FacebookService,
  ) {}

  @Get()
  verify(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
    @Res() res: Response,
  ) {
    const result = this.webhookService.verifyWebhook(mode, token, challenge);
    if (result) {
      return res.status(HttpStatus.OK).send(result);
    }
    return res.sendStatus(HttpStatus.FORBIDDEN);
  }

  @Post()
  async receive(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    const signature = req.headers['x-hub-signature-256'] as string | undefined;
    const rawBody = req.rawBody;

    if (rawBody && !this.facebookService.verifySignature(rawBody, signature)) {
      return res.sendStatus(HttpStatus.FORBIDDEN);
    }

    await this.webhookService.handleWebhookPayload(req.body);
    return res.sendStatus(HttpStatus.OK);
  }
}
