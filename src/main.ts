import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';  // Import body-parser

import { AppModule } from './app.module';
require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use('/', express.static(path.join(__dirname, '../src/upload')));
  
  app.enableCors();

  app.setGlobalPrefix('api/v1');
  
  app.use(bodyParser.json({ limit: '10mb' }));  // Set JSON payload limit to 10MB
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));  // Set URL-encoded payload limit to 10MB
  
  await app.listen(process.env.PORT || 8000);
}

bootstrap();
