import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDTO } from './dto/subjects.dto';
import { Subject } from 'src/typeorm/entities/subject';
import { JwtGuard } from 'src/admin/Guard';

@Controller('subjects')
export class SubjectsController {

    constructor(private readonly subjectService:SubjectsService){}


    @Post()
    @UsePipes(new ValidationPipe({
        whitelist: true,
        transform: true,
      }))

      
    @UseGuards(JwtGuard)
    async create(@Body() dto:CreateSubjectDTO):Promise<Subject>{
        return await this.subjectService.createSubject(dto)
    }
    @Get('')
    @UsePipes(new ValidationPipe({
      whitelist: true,
      transform: true,
    }))
   @UseGuards(new JwtGuard)
    async findAll(
      @Query('page', ParseIntPipe) page = 1,
      @Query('limit', ParseIntPipe) limit = 10,
        ) {
      const options = { page, limit };
      return this.subjectService.findAll(options);
    }
    @Get('level')
    @UsePipes(new ValidationPipe({
      whitelist: true,
      transform: true,
    }))
    async findAllLevel(
      @Query('page', ParseIntPipe) page = 1,
      @Query('limit', ParseIntPipe) limit = 10,
      @Query('Category') Category :number,
      @Query('IdEducation') IdEducation :number,

        ) {
      const options = { page, limit };
      return this.subjectService.findByEducationAndLevel(options ,Category,IdEducation);
    }


    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Subject> {
        return this.subjectService.findOneByd(id);
    }
    @Put(':id')
    @UseGuards(new JwtGuard)
    async update(@Param('id', ParseIntPipe) id: number ,@Body() dto:CreateSubjectDTO): Promise<Subject> {
        return this.subjectService.updateSubject(id,dto);
    }

}
