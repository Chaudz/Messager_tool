import { Module } from '@nestjs/common';
import { WebhookController } from './controllers/webhook.controller';
import { WebhookService } from './services/webhook.service';
import { QueueModule } from '../../queues/queue.module';

@Module({
  imports: [QueueModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
