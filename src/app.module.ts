import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { Teacher } from './typeorm/entities/Teacher';
import { TeacherModule } from './teacher/teacher.module';
import { ClasseModule } from './classe/classe.module';
import { OrderModule } from './order/order.module';
import { AdminModule } from './admin/admin.module';
import { Classes } from './typeorm/entities/Classes';
import { BullModule } from '@nestjs/bull';
import { TRANSCODE_QUEUE } from './constants';
import { TranscodeConsumer } from './transcode.consumer';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { CategoryModule } from './category/category.module';
import { Category } from './typeorm/entities/Category';
import { Levels } from './typeorm/entities/Levels';
import { LevelsModule } from './levels/levels.module';
import { User } from './typeorm/entities/User';
import { Order } from './typeorm/entities/Order';
import { Admin } from './typeorm/entities/Admin';
import {Lesson } from './typeorm/entities/Lesson';
import { LessonModule } from './lesson/lesson.module';
import { AttendanceModule } from './attendance/attendance.module';
import { Attendance } from './typeorm/entities/Attendance';
import { Balance } from './typeorm/entities/Balance';
import { AcaOrderModule } from './aca-order/aca-order.module';
import { AcaOrder } from './typeorm/entities/acaOrders';
import { EducationalCycleModule } from './educational_cycle/educational_cycle.module';
import { Type } from './typeorm/entities/Type';
import { Educational_cycle } from './typeorm/entities/Educational_cycle';
import { Subject } from './typeorm/entities/subject';
import { SubjectsModule } from './subjects/subjects.module';
import { UploadImageModule } from './upload-image/upload-image.module';


@Module({
  imports: [

    BullModule.forRoot({
      redis: {
        host: 'redis',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name:TRANSCODE_QUEUE,
    }),
    ConfigModule.forRoot(),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          service: 'gmail',
          secure: false,
          auth: {
            user: 'doondoon273@gmail.com',
            pass: 'jdrtjxfudnfurmpe',
          },
        },
        defaults: {
          from: 'doondoon273@gmail.com',
        },
        template: {
          dir: join(__dirname, '../src/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port:  Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Subject  ,Teacher,Classes ,Type, Educational_cycle  ,Category , Levels,
         User,Order ,Admin,Lesson,Attendance,Balance,AcaOrder],
      synchronize: true,
    }),
    UsersModule,
    TeacherModule,
    ClasseModule,
    OrderModule,
    AdminModule,
    CategoryModule,
    LevelsModule,
    LessonModule,
    AttendanceModule,
    AcaOrderModule,
    EducationalCycleModule,
    SubjectsModule,
    UploadImageModule
  ],
  controllers: [AppController],
  providers: [AppService ,TranscodeConsumer],
})
export class AppModule {}
