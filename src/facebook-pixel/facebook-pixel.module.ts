import { Module } from '@nestjs/common';
import { FacebookPixelService } from './facebook-pixel.service';
import { FacebookPixelController } from './facebook-pixel.controller';

@Module({
  providers: [FacebookPixelService],
  controllers: [FacebookPixelController]
})
export class FacebookPixelModule {}
