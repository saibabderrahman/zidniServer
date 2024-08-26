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
import { Duties } from './typeorm/entities/duties';
import { DutiesModule } from './duties/duties.module';
import { Solution } from './typeorm/entities/solution';
import { SolutionModule } from './solution/solution.module';
import { Note } from './typeorm/entities/Notes';
import { NoteModule } from './note/note.module';
import { Type_Education } from './typeorm/entities/typeOfEducation';
import { TypeEducationModule } from './type_education/type_education.module';
import { QuranTafseerModule } from './quran-tafseer/quran-tafseer.module';
import { StatesModule } from './states/states.module';
import { FacebookPixelModule } from './facebook-pixel/facebook-pixel.module';
import { Answer, Commune, FacebookPixel, MessengerRegistrationState, Question, Quiz, RegistrationState, Wilaya } from './typeorm/entities';
import { Logger } from 'winston';
import { LoggerService } from './logger.service';
import { TelegramModule } from './telegram/telegram.module';
import { RegistrationStateModule } from './registration-state/registration-state.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MessengerModule } from './messenger/messenger.module';
import { MessenagerBotModule } from './messenager-bot/messenager-bot.module';
import { QuizModule } from './quiz/quiz.module';
import { AnswerModule } from './answer/answer.module';



@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'redis',
        port: 6379,
      },
    }),
    ScheduleModule.forRoot(),

    BullModule.registerQueue({
      name:TRANSCODE_QUEUE,
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          service: 'gmail',
          secure: true,
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
      entities: [Subject,Quiz,Question,Answer, MessengerRegistrationState, Note,RegistrationState ,Solution ,Teacher,Classes ,Type, Educational_cycle  ,Category , Levels,
         User,Order ,Admin,Lesson,Attendance,Balance,AcaOrder ,Duties ,Type_Education ,Wilaya,Commune,FacebookPixel],
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
    UploadImageModule,
    DutiesModule,
    SolutionModule,
    NoteModule,
    TypeEducationModule,
    QuranTafseerModule,
    StatesModule,
    FacebookPixelModule,
    TelegramModule,
    RegistrationStateModule,
    MessengerModule,
    MessenagerBotModule,
    QuizModule,
    AnswerModule,
  ],
  controllers: [AppController],
  providers: [AppService ,TranscodeConsumer,

    {
      provide: Logger,
      useClass: LoggerService,
    },
  ],
})
export class AppModule {}
