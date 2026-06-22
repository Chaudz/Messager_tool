import { Module } from '@nestjs/common';
import { QueueModule } from '../../queues/queue.module';
import { SpamGuardService } from './spam-guard.service';

@Module({
  imports: [QueueModule],
  providers: [SpamGuardService],
  exports: [SpamGuardService],
})
export class SpamModule {}
