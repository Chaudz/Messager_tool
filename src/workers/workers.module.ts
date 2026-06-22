import { Module } from '@nestjs/common';
import { QueueModule } from '../queues/queue.module';
import { CustomerModule } from '../modules/customer/customer.module';
import { ConversationModule } from '../modules/conversation/conversation.module';
import { MessageModule } from '../modules/message/message.module';
import { AiModule } from '../modules/ai/ai.module';
import { SpamModule } from '../modules/spam/spam.module';
import { IncomingMessageProcessor } from './incoming-message.processor';
import { AiProcessingProcessor } from './ai-processing.processor';
import { SendMessageProcessor } from './send-message.processor';

@Module({
  imports: [
    QueueModule,
    CustomerModule,
    ConversationModule,
    MessageModule,
    AiModule,
    SpamModule,
  ],
  providers: [
    IncomingMessageProcessor,
    AiProcessingProcessor,
    SendMessageProcessor,
  ],
})
export class WorkersModule {}
