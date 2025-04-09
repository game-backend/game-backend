import { NestFactory } from '@nestjs/core';
import { LeaderboardModule } from './leaderboard.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from 'apps/shared/errors/all-exceptions-filter';
import { setupSwaggerDocumentations } from '@app/shared/utils/setup-swagger-documentation';

async function bootstrap() {
  const app = await NestFactory.create(LeaderboardModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  app.setGlobalPrefix('api/leaderboard');
  if (process.env.NODE_ENV !== 'production') {
    setupSwaggerDocumentations(app, 'leaderboard-service', 'LeaderBoard API', '1.0');
  }
  const PORT = process.env.NODE_ENV === 'production' ? 3000 : process.env.LEADERBOARD_SERVICE_PORT;

  await app.listen(PORT);
}
bootstrap();
