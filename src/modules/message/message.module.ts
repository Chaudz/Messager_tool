import { Module, forwardRef } from '@nestjs/common';
import { MessageRepository } from './repositories/message.repository';
import { MessageService } from './services/message.service';
import { ConversationModule } from '../conversation/conversation.module';

@Module({
  imports: [forwardRef(() => ConversationModule)],
  providers: [MessageRepository, MessageService],
  exports: [MessageRepository, MessageService],
})
export class MessageModule {}
