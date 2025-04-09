import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwaggerDocumentations = (app: INestApplication, service: string, title: string, version: string) => {
  const config = new DocumentBuilder().setTitle(title).setDescription('API documentation').setVersion(version).build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
};
