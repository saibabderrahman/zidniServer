import { Module } from '@nestjs/common';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import { Teacher } from '../typeorm/entities/Teacher';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import * as path from 'path';
import * as multer from 'multer';
import { Classes } from '../typeorm/entities/Classes';
import { BullModule } from '@nestjs/bull';
import { TRANSCODE_QUEUE } from '../constants';
import { JwtGuard } from '../admin/Guard';
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../src/upload'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = file.originalname.split('.')[0];
    cb(null, filename + '-' + uniqueSuffix + '.webp');
  },
});

@Module({
  imports:[TypeOrmModule.forFeature([Teacher,Classes]) ,
  BullModule.registerQueue({
    name:TRANSCODE_QUEUE,
  }),
  MulterModule.register({
    storage: storage,
  }),  JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '24h' },
  }),],
  controllers: [TeacherController],
  providers: [TeacherService,JwtGuard],
  exports:[TeacherService]
})
export class TeacherModule {}
