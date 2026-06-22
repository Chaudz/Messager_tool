import { Module } from '@nestjs/common';
import { FaqRepository } from './repositories/faq.repository';
import { FaqService } from './services/faq.service';
import { FaqController } from './controllers/faq.controller';

@Module({
  controllers: [FaqController],
  providers: [FaqRepository, FaqService],
  exports: [FaqRepository, FaqService],
})
export class FaqModule {}
