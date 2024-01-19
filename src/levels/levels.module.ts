import { Module } from '@nestjs/common';
import { LevelsService } from './levels.service';
import { LevelsController } from './levels.controller';
import { Levels } from '../typeorm/entities/Levels';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeEducationModule } from 'src/type_education/type_education.module';
import { EducationalCycleModule } from 'src/educational_cycle/educational_cycle.module';

@Module({
  imports:[TypeOrmModule.forFeature([Levels]),TypeEducationModule,EducationalCycleModule],
  providers: [LevelsService],
  controllers: [LevelsController],
  exports:[LevelsService]

})
export class LevelsModule {}
