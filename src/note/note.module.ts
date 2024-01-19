import { BadRequestException, Module } from '@nestjs/common';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from 'src/typeorm/entities/Notes';
import { SolutionModule } from 'src/solution/solution.module';

import { MulterModule } from '@nestjs/platform-express';
import * as path from 'path';
import * as multer from 'multer';

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
  imports:[TypeOrmModule.forFeature([Note])   ,   MulterModule.register({
    storage: storage,
    fileFilter: (req, file, callback) => {
      if (file.mimetype === 'audio/mpeg' || file.mimetype === 'audio/mp3' || file.mimetype === 'audio/webm' || file.mimetype === 'audio/m4a') {
        callback(null, true);
      } else {
        callback(new BadRequestException('Invalid file type. Only MP3 files are allowed.'), false);
      }
    },
  }),SolutionModule],

  controllers: [NoteController],
  providers: [NoteService]
})
export class NoteModule {}
