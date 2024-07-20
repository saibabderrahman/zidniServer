import { Module } from '@nestjs/common';
import { UploadImageService } from './upload-image.service';
import { UploadImageController } from './upload-image.controller';
import { MulterModule } from '@nestjs/platform-express';
import * as path from 'path';
import * as multer from 'multer';



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../src/upload');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = file.originalname.split('.')[0];
    const ext = path.extname(file.originalname);
    cb(null, `${filename}-${uniqueSuffix}${ext}`);
  },
});


@Module({
  imports:[  MulterModule.register({
    storage,
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype.startsWith('image/') ||
        file.mimetype.startsWith('video/') ||
        file.mimetype === 'application/pdf' ||
        file.mimetype.startsWith('audio/')
      ) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type!'), false);
      }
    },
  }),],
  providers: [UploadImageService],
  controllers: [UploadImageController]
})
export class UploadImageModule {}
