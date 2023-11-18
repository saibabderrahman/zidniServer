import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../admin/Guard';
import { Request, Response } from 'express';
import { LessonService } from './lesson.service';
import { LessonDto } from './dto';

@Controller('lesson')
export class LessonController {
    constructor(private LessonService:LessonService){}

    @Post("")
    @UseGuards(JwtGuard)
    async create( @Body() dto:LessonDto){
        const data = await this.LessonService.CreateLesson(dto)
        return data
     
    }

    
    @Get("")
    @UseGuards(new JwtGuard)
    async findAll(
      @Query('page', ParseIntPipe) page = 1,
      @Query('limit', ParseIntPipe) limit = 10,
        ) {
      const options = { page, limit };
      return this.LessonService.findAll(options);
    }
    @Get("all")
    async getAll(){
        const data = await this.LessonService.getClasses()
        return data
      
    }

    
    @Put(":id")
    @UseGuards(JwtGuard)
    async updateOneByID(@Param('id',new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }) ) id: number){
        const data = await this.LessonService.updateOneByID(id)
        return data
    }
    @Get(":id")
    @UseGuards(JwtGuard)
    async Get(@Param('id',new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }) ) id: number){
        const data = await this.LessonService.findOneByID(id)
        return data
    }
}
