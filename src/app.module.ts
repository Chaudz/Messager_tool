import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { RedisModule } from './infrastructure/redis/redis.module';
import { FacebookModule } from './infrastructure/facebook/facebook.module';
import { OpenAiModule } from './infrastructure/openai/openai.module';
import { QueueModule } from './queues/queue.module';
import { WorkersModule } from './workers/workers.module';
import { WebhookModule } from './modules/webhook/webhook.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConversationModule } from './modules/conversation/conversation.module';
import { MenuModule } from './modules/menu/menu.module';
import { FaqModule } from './modules/faq/faq.module';
import { ReservationModule } from './modules/reservation/reservation.module';
import { SettingsModule } from './modules/settings/settings.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RedisModule,
    FacebookModule,
    OpenAiModule,
    QueueModule,
    WorkersModule,
    WebhookModule,
    AuthModule,
    ConversationModule,
    MenuModule,
    FaqModule,
    ReservationModule,
    SettingsModule,
    AiModule,
  ],
})
export class AppModule {}
