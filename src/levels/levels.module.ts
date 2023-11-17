import { Module } from '@nestjs/common';
import { LevelsService } from './levels.service';
import { LevelsController } from './levels.controller';
import { Levels } from '../typeorm/entities/Levels';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([Levels])],
  providers: [LevelsService],
  controllers: [LevelsController],
  exports:[LevelsService]

})
export class LevelsModule {}
