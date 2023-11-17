import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from '../typeorm/entities/Attendance';
import { JwtStrategy } from '../admin/strategy';
import { Admin } from '../typeorm/entities/Admin';
import { User } from '../typeorm/entities/User';
import { Classes } from '../typeorm/entities/Classes';
import { Lesson } from '../typeorm/entities/Lesson';
import { Order } from '../typeorm/entities/Order';
import { AcaOrder } from 'src/typeorm/entities/acaOrders';
import { Subject } from 'src/typeorm/entities/subject';


@Module({
  imports:[TypeOrmModule.forFeature([Attendance,Subject,Admin,User,Classes,Lesson,Order,AcaOrder])],
  providers: [AttendanceService,JwtStrategy],
  controllers: [AttendanceController]
})
export class AttendanceModule {}
