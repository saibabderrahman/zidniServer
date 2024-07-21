import { Controller, Get, Post, Put, Delete, Param, Body, UsePipes, ValidationPipe, Query, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { Educational_cycle } from 'src/typeorm/entities/Educational_cycle';
import { EducationalCycleService } from './educational_cycle.service';
import { EducationalCycleDTO } from './dto/EducationalCycleDTO';
import { JwtGuard } from 'src/admin/Guard';

@Controller('educational-cycles')
export class EducationalCycleController {
    constructor(private readonly educationalCycleService: EducationalCycleService) {}

    @Post()
    @UsePipes(new ValidationPipe({
        whitelist: true,
        transform: true,
      }))
      async create(@Body() data: EducationalCycleDTO): Promise<Educational_cycle> {
        return this.educationalCycleService.create(data);
    }

    @Get()
    async findAll(
        @Query('page', ParseIntPipe) page = 1,
        @Query('limit', ParseIntPipe) limit = 10,
  
    ) {
        const options = { page, limit };
        return this.educationalCycleService.findAll(options);
    }
    @Get("all")
    async findAllFrontEnd(
        @Query('page', ParseIntPipe) page = 1,
        @Query('limit', ParseIntPipe) limit = 10,
  
    ) {
        const options = { page, limit };
        return this.educationalCycleService.findFrontEnd(options);
    }



    @Get('student/:id')
    async findOneByStudnet(@Param('id') id: number): Promise<Educational_cycle []> {
        return this.educationalCycleService.findOneStudent(id);
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Educational_cycle> {
        return this.educationalCycleService.findOneFrontEnd(id);
    }
    @Get('admin:id')
    @UseGuards(new JwtGuard)
    async findOneAdmin(@Param('id') id: number): Promise<Educational_cycle> {
        return this.educationalCycleService.findOne(id);
    }

    @Put(':id')
    async  update(@Param('id') id: number, @Body() data: Educational_cycle): Promise<Educational_cycle> {
        return this.educationalCycleService.update(id, data);
    }
    @Patch(':id')
    async hide(@Param('id') id: number): Promise<void> {
        return this.educationalCycleService.hideOne(id);
    }

    @Delete(':id')
    async remove(@Param('id') id: number): Promise<void> {
        return this.educationalCycleService.remove(id);
    }
}
