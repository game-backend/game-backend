import { NestFactory } from '@nestjs/core';
import { PlayersManagementModule } from './players-management.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from 'apps/shared/errors/all-exceptions-filter';
import { setupSwaggerDocumentations } from '@app/shared/utils/setup-swagger-documentation';

async function bootstrap() {
  const app = await NestFactory.create(PlayersManagementModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  app.setGlobalPrefix('api/players-management');
  if (process.env.NODE_ENV !== 'production') {
    setupSwaggerDocumentations(app, 'players-management-service', 'Players Management API', '1.0');
  }
  const PORT = process.env.NODE_ENV === 'production' ? 3000 : process.env.PLAYERSMANAGEMENT_SERVICE_PORT;

  await app.listen(PORT);
}
bootstrap();
