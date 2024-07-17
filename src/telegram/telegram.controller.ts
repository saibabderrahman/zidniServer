import { Controller, Post, Body, HttpCode, Get, Query, Param } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post('')
  @HttpCode(200)
  async handleRequest(@Body() body: any,@Query("education") education:number): Promise<void> {
    if (body.message && body.message.text) {
      const text = body.message.text.trim();

      if (text.charAt(0) === '/') {
        const command = text.substr(1).split(' ')[0];
        await this.telegramService.handleCommand(command, body.message ,education);
      } else {
        await this.telegramService.handleMessage(body.message ,education);
      }
    }
  }
  @Get('')
  @HttpCode(200)
  async handleGet(@Body() body: any ,@Query("education") education:number): Promise<void> {
    if (body.message && body.message.text) {
      const text = body.message.text.trim();

      if (text.charAt(0) === '/') {
        const command = text.substr(1).split(' ')[0];
        await this.telegramService.handleCommand(command, body.message ,education);
      } else {
        await this.telegramService.handleMessage(body.message ,education);
      }
    }
  }
  @Post(':id')
  async sendMessage(
    @Param('id') id: number,
    @Body('message') message: string,
  ) {
    await this.telegramService.sendMessageSingleChat(id,message)

  }
}
