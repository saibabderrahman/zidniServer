import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get("sendmail")
  sendmail(){
    return this.appService.sendMAil();
  }

  @Post("transcode")
  async transcode(){
    return this.appService.transcode()
  }
  
}
