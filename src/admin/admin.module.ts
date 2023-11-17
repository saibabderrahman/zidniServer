import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import * as path from 'path';
import * as multer from 'multer';
import { BullModule } from '@nestjs/bull';
import { TRANSCODE_QUEUE } from '../constants';
import { Admin } from '../typeorm/entities/Admin';
import { Teacher } from '../typeorm/entities/Teacher';
import { Classes } from '../typeorm/entities/Classes';
import { Category } from '../typeorm/entities/Category';
import { Levels } from '../typeorm/entities/Levels';
import { Order } from '../typeorm/entities/Order';
import { User } from '../typeorm/entities/User';
import { JwtStrategy } from "./strategy";



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../upload'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = file.originalname.split('.')[0];
    cb(null, filename + '-' + uniqueSuffix + '.png');
  },
});

@Module({
  imports:[TypeOrmModule.forFeature([Admin , Teacher ,Classes,User,Order,Category,Levels]) ,
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
  controllers: [AdminController],
  providers: [AdminService,JwtStrategy]
})
export class AdminModule {}
