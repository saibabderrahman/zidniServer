import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizService.createQuiz(createQuizDto);
  }

  @Get()
  findAll() {
    return this.quizService.findAll();
  }
  @Get(":id")
  findOne(@Param("id" ) id:number) {
    return this.quizService.findOne(id);
  }


}
