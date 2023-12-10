import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from '../typeorm/entities/Attendance';
import { JwtStrategy } from '../admin/strategy';
import { Admin } from '../typeorm/entities/Admin';
import { User } from '../typeorm/entities/User';
import { Classes } from '../typeorm/entities/Classes';
import { Lesson } from '../typeorm/entities/Lesson';
import { Order } from '../typeorm/entities/Order';
import { Subject } from 'src/typeorm/entities/subject';


@Module({
  imports:[TypeOrmModule.forFeature([Attendance,Admin,User,Classes,Lesson,Order,Subject])],
  providers: [LessonService,JwtStrategy],
  controllers: [LessonController],
  exports:[LessonService]
})
export class LessonModule {}
