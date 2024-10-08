import { Module } from '@nestjs/common';
import { DutiesController } from './duties.controller';
import { DutiesService } from './duties.service';
import { Duties } from 'src/typeorm/entities/duties';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonModule } from 'src/lesson/lesson.module';
import { LevelsModule } from 'src/levels/levels.module';

@Module({
  imports:[TypeOrmModule.forFeature([Duties]) ,LessonModule,LevelsModule],
  controllers: [DutiesController],
  providers: [DutiesService]
  ,exports:[DutiesService]
})
export class DutiesModule {}
