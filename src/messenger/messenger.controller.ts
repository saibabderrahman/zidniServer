import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { MessengerService } from './messenger.service';

@Controller('messenger')
export class MessengerController {
  constructor(
    private configService: ConfigService,
    private messengerService: MessengerService,
  ) {}

  @Get("webhook")
  verifyWebhook(@Req() req: Request, @Res() res: Response): void {
    const VERIFY_TOKEN = this.configService.get<string>('VERIFY_TOKEN');

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode && token) {
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    }
  }



  @Post("webhook")
  async handleWebhook(@Req() req: Request, @Res() res: Response): Promise<void> {
    const body = req.body;
    if (body.object === 'page') {
      body.entry.forEach(async (entry) => {
        const webhookEvent = entry.messaging[0];
        const senderPsid = webhookEvent.sender.id;
        console.log(senderPsid)
        if (webhookEvent.message) {
          await this.messengerService.handleMessage(senderPsid, webhookEvent.message);
        } else if (webhookEvent.postback) {
          await this.messengerService.handlePostback(senderPsid, webhookEvent.postback);
        }
      });

      res.status(200).send('EVENT_RECEIVED');
    } else {
      res.sendStatus(404);
    }
  }
}
