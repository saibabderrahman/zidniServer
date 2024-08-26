import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer, Quiz } from 'src/typeorm/entities';

@Module({
  imports:[TypeOrmModule.forFeature([Quiz,Answer])],

  providers: [AnswerService],
  controllers: [AnswerController]
})
export class AnswerModule {}
