import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT', 3001);
  const adminOrigin = config.get<string>('ADMIN_ORIGIN', 'http://localhost:3000');

  app.enableCors({
    origin: adminOrigin,
    credentials: true,
  });

  await app.listen(port);
  logger.log(`Server running on http://localhost:${port}`);
}
bootstrap();
