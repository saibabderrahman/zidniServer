import { Module } from '@nestjs/common';
import { MessengerService } from './messenger.service';
import { MessengerController } from './messenger.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessengerRegistrationState } from 'src/typeorm/entities';

@Module({
  imports:[TypeOrmModule.forFeature([MessengerRegistrationState])],
  providers: [MessengerService],
  controllers: [MessengerController]
})
export class MessengerModule {}
