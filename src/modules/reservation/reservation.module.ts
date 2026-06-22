import { Module } from '@nestjs/common';
import { ReservationRepository } from './repositories/reservation.repository';
import { ReservationService } from './services/reservation.service';
import { ReservationController } from './controllers/reservation.controller';
import { ConversationModule } from '../conversation/conversation.module';

@Module({
  imports: [ConversationModule],
  controllers: [ReservationController],
  providers: [ReservationRepository, ReservationService],
  exports: [ReservationRepository, ReservationService],
})
export class ReservationModule {}
