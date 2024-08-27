import { Controller, Post, Body, Get, Param, Delete, UsePipes, ValidationPipe, Put } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  @UsePipes(new ValidationPipe({
    whitelist:true,
    transform:true
  }))
  async create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizService.createQuiz(createQuizDto);
  }

  @Get()
  async findAll() {
    return this.quizService.findAll();
  }
  @Get(":id")
 async findOne(@Param("id" ) id:number) {
    return this.quizService.findOne(id);
  }

  @Put(":id")
  @UsePipes(new ValidationPipe({
    whitelist:true,
    transform:true
  }))
  async update(@Body() createQuizDto: CreateQuizDto,@Param("id" ) id:number) {
    return this.quizService.updateQuiz(id,createQuizDto);
  }


}
