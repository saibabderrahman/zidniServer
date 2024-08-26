import { Controller, Post, Body, Get, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { Answer } from 'src/typeorm/entities';

@Controller('answers')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Post()
  @UsePipes(new ValidationPipe({
    whitelist:true,
    transform:true
  }))
  create(@Body() createAnswerDto: CreateAnswerDto): Promise<Answer> {
    return this.answerService.create(createAnswerDto);
  }

  @Get()
  findAll(): Promise<Answer[]> {
    return this.answerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Answer> {
    return this.answerService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.answerService.remove(id);
  }
}
