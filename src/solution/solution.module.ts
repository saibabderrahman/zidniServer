import { BadRequestException, Module } from '@nestjs/common';
import { SolutionService } from './solution.service';
import { SolutionController } from './solution.controller';
import { Solution } from 'src/typeorm/entities/solution';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import * as path from 'path';
import * as multer from 'multer';
import { DutiesModule } from 'src/duties/duties.module';
import { UsersModule } from 'src/users/users.module';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../src/upload'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = file.originalname.split('.')[0];
    cb(null, filename + '-' + uniqueSuffix + '.mp3');
  },
});

@Module({
  imports: [
    TypeOrmModule.forFeature([Solution]),
    MulterModule.register({
      storage: storage,
      fileFilter: (req, file, callback) => {
        if (file.mimetype === 'audio/mpeg' || file.mimetype === 'audio/mp3' || file.mimetype === 'audio/webm' || file.mimetype === 'audio/m4a') {
          callback(null, true);
        } else {
          callback(new BadRequestException('Invalid file type. Only MP3 files are allowed.'), false);
        }
      },
    }),DutiesModule,UsersModule
  ],
  providers: [SolutionService],
  controllers: [SolutionController],
  exports:[SolutionService]
})
export class SolutionModule {}
