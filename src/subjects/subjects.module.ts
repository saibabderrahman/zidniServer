import { Module } from '@nestjs/common';
import { SubjectsController } from './subjects.controller';
import { SubjectsService } from './subjects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from 'src/typeorm/entities/subject';
import { TeacherModule } from 'src/teacher/teacher.module';
import { CategoryModule } from 'src/category/category.module';
import { LevelsModule } from 'src/levels/levels.module';
import { EducationalCycleModule } from 'src/educational_cycle/educational_cycle.module';

@Module({
  imports:[TypeOrmModule.forFeature([Subject]),TeacherModule,CategoryModule,LevelsModule,EducationalCycleModule],
  controllers: [SubjectsController],
  providers: [SubjectsService]
})
export class SubjectsModule {}
