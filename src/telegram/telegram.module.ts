import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcaOrder, RegistrationState } from 'src/typeorm/entities';
import { EducationalCycleModule } from 'src/educational_cycle/educational_cycle.module';
import { AcaOrderModule } from 'src/aca-order/aca-order.module';
import { LoggerService } from 'src/logger.service';

@Module({
  imports:[TypeOrmModule.forFeature([RegistrationState,AcaOrder]) ,EducationalCycleModule,AcaOrderModule],

  providers: [TelegramService,LoggerService],
  controllers: [TelegramController]
})
export class TelegramModule {}
