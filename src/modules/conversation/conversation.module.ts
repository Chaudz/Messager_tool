import { Module, forwardRef } from '@nestjs/common';
import { ConversationRepository } from './repositories/conversation.repository';
import { ConversationService } from './services/conversation.service';
import { ConversationController } from './controllers/conversation.controller';
import { CustomerModule } from '../customer/customer.module';
import { MessageModule } from '../message/message.module';
import { QueueModule } from '../../queues/queue.module';

@Module({
  imports: [CustomerModule, forwardRef(() => MessageModule), QueueModule],
  controllers: [ConversationController],
  providers: [ConversationRepository, ConversationService],
  exports: [ConversationRepository, ConversationService],
})
export class ConversationModule {}
