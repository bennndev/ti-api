import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { auth } from './lib/auth';
import { toNodeHandler } from 'better-auth/node';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import express from 'express';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  // Mount Better Auth routes on /auth/* BEFORE express.json()
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.all('/auth/{*splat}', toNodeHandler(auth));

  const config = new DocumentBuilder()
    .setTitle('ti-api')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, cleanupOpenApiDoc(document));

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Application running on port ${port}`);
}
bootstrap();
