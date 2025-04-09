import { NestFactory } from '@nestjs/core';
import { GameScoresModule } from './game-scores.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from 'apps/shared/errors/all-exceptions-filter';
import { setupSwaggerDocumentations } from '@app/shared/utils/setup-swagger-documentation';

async function bootstrap() {
  const app = await NestFactory.create(GameScoresModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  app.setGlobalPrefix('api/game-scores');
  if (process.env.NODE_ENV !== 'production') {
    setupSwaggerDocumentations(app, 'game-scores-service', 'Game Scores API', '1.0');
  }
  const PORT = process.env.NODE_ENV === 'production' ? 3000 : process.env.GAME_SCORES_SERVICE_PORT;

  await app.listen(PORT);
}
bootstrap();
