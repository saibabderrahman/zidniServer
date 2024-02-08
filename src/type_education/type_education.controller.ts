import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { TypeEducationService } from './type_education.service';
import { JwtGuard } from 'src/admin/Guard';
import { TypeEducationDto } from './dto/TypeEducationDto';

@Controller('type-education')
export class TypeEducationController {
    constructor(private readonly type_EducationService:TypeEducationService){}

    @Post()
    @UsePipes(new ValidationPipe({
        whitelist: true,
        transform: true,
      }))
     @UseGuards(new JwtGuard)
  
    async create(@Body() dto:TypeEducationDto ){
        const data = await this.type_EducationService.create(dto)
        return data
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
      return this.type_EducationService.findAll(options);
    }

    @Put(":id")
    @UsePipes(new ValidationPipe({
        whitelist: true,
        transform: true,
      }))
    @UseGuards(new JwtGuard)
    async update(@Param('id', ParseIntPipe) id: number,@Body() dto:TypeEducationDto ){
        dto.id= id
        const data = await this.type_EducationService.update(dto)
        return data
    }






     }
  
