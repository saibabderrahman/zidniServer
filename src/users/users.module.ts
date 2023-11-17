import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '../typeorm/entities/User';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { TRANSCODE_QUEUE } from '../constants';
import { MulterModule } from '@nestjs/platform-express';
import * as path from 'path';
import * as multer from 'multer';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategy';


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
  imports: [TypeOrmModule.forFeature([User]) ,
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
  controllers: [UsersController],
  providers: [UsersService , JwtStrategy],
  exports:[UsersService]
})
export class UsersModule {}
