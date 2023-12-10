import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, ValidationPipe, UsePipes, UseGuards, Query } from '@nestjs/common';
import { DutiesService } from './duties.service';
import { DutiesDTO } from './dto/DutiesDTO';
import { JwtGuard } from 'src/admin/Guard';

@Controller('duties')
export class DutiesController {
  constructor(private readonly dutiesService: DutiesService) {}

  @Post()
  @UsePipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }))

  
 @UseGuards(JwtGuard)
  async createDuty(@Body(new ValidationPipe()) dutiesDTO: DutiesDTO) {
    return await this.dutiesService.createDuty(dutiesDTO);
  }

  @Get()
  async getAllDuties(      @Query('page', ParseIntPipe) page = 1,
  @Query('limit', ParseIntPipe) limit = 10,
    ) {
  const options = { page, limit };

    return await this.dutiesService.getAllDuties(options);
  }
  @Get("user")
  async getAllDutiesByUser(      @Query('page', ParseIntPipe) page = 1,
  @Query('limit', ParseIntPipe) limit = 10,
  @Query('id', ParseIntPipe) id:number,
    ) {
  const options = { page, limit };

    return await this.dutiesService.getAllDutiesByUserID(options ,id);
  }

  @Get(':id')
  async getDutyById(@Param('id', ParseIntPipe) id: number) {
    return await this.dutiesService.getDutyById(id);
  }

  @Put(':id')
  async updateDuty(@Param('id', ParseIntPipe) id: number, @Body(new ValidationPipe()) dutiesDTO: DutiesDTO) {
    return await this.dutiesService.updateDuty(id, dutiesDTO);
  }

  @Delete(':id')
  async deleteDuty(@Param('id', ParseIntPipe) id: number) {
    return await this.dutiesService.deleteDuty(id);
  }
}
