import { Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question, Quiz } from 'src/typeorm/entities';

@Module({
  imports:[TypeOrmModule.forFeature([Quiz,Question])],
  controllers: [QuizController],
  providers: [QuizService]
})
export class QuizModule {}
