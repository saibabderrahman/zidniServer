import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, ValidationPipe, UsePipes, UseGuards, Query, Req } from '@nestjs/common';
import { DutiesService } from './duties.service';
import { DutiesDTO } from './dto/DutiesDTO';
import { JwtGuard } from 'src/admin/Guard';
import { JwtGuard as userGuard } from 'src/users/Guard';
import { User } from 'src/typeorm/entities/User';

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
  async getAllDuties(      
  @Query('page', ParseIntPipe) page = 1,
  @Query('limit', ParseIntPipe) limit = 10,
  @Query('lesson') lesson:number ,
  @Query("level") level:number ,
    ) {
  const options = { page, limit };
    return await this.dutiesService.getAllDuties({options,lesson,level});
  }
  @Get("user")
  async getAllDutiesByUser(      @Query('page', ParseIntPipe) page = 1,
  @Query('limit', ParseIntPipe) limit = 10,
  @Query('id', ParseIntPipe) id:number,
    ) {
  const options = { page, limit };

    return await this.dutiesService.getAllDutiesByUserID(options ,id);
  }
  @Get("solution")
  @UseGuards(userGuard)

  async getAllSolution(      @Query('page', ParseIntPipe) page = 1,
  @Query('limit', ParseIntPipe) limit = 10,
@Req() Dto:any
    ) {
  const options = { page, limit };
  const teacher:User = Dto.user as User; 
  let id= teacher.id


    return await this.dutiesService.getAllDutiesByUser(options ,id);
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
