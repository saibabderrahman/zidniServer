import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { TRANSCODE_QUEUE } from './constants';
import { MailerService } from '@nestjs-modules/mailer';


@Injectable()
export class AppService {
  constructor(
    @InjectQueue(TRANSCODE_QUEUE) private readonly transcodeQueue: Queue,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }
 async sendMAil(){
  await this.transcodeQueue.add({
    to:"saibabderrahman@gmail.com",
    template: 'email',
    subject:"hi there"
  });
  }

  async transcode() {
    await this.transcodeQueue.add({
      fileName: './file.mp3',
    });  }
}
