import { Module } from '@nestjs/common';
import { MessenagerBotService } from './messenager-bot.service';
import { MessenagerBotController } from './messenager-bot.controller';
import { MessengerRegistrationState } from 'src/typeorm/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([MessengerRegistrationState])],
  providers: [MessenagerBotService],
  controllers: [MessenagerBotController]
})
export class MessenagerBotModule {}
