import { Module } from '@nestjs/common';
import { StatesController } from './states.controller';
import { StatesService } from './states.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commune, Wilaya } from 'src/typeorm/entities';
import { LoggerService } from 'src/logger.service';

@Module({
  imports:[TypeOrmModule.forFeature([Wilaya,Commune])],
  controllers: [StatesController],
  providers: [StatesService,LoggerService]
})
export class StatesModule {}
