import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import * as path from 'path';

import { AppModule } from './app.module';
require('dotenv').config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/', express.static(path.join(__dirname, '../src/upload')));
  app.enableCors();
  app.setGlobalPrefix('api/v1'); // Add this line to set the global prefix

 await app.listen(process.env.PORT || 8000);
}
bootstrap();
