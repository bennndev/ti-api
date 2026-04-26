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

  // Enable CORS for frontend on port 3001
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

  // Mount Better Auth routes on /better-auth/* BEFORE other routes
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.all('/better-auth/{*splat}', toNodeHandler(auth));

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
