// src/modules/solution/solution.controller.ts

import { Controller, Post, Body, ValidationPipe, UseInterceptors, UploadedFile, UseGuards, Req, Query, Get, ParseIntPipe } from '@nestjs/common';
import { SolutionService } from './solution.service';
import { CreateSolutionDto } from './dto/solutions.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'src/users/Guard';
import { User } from 'src/typeorm/entities/User';

@Controller('solution')
export class SolutionController {
  constructor(private readonly solutionService: SolutionService) {}

  @Post('')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('audioFile'))
  async createSolution(@Body() createSolutionDto: CreateSolutionDto ,@UploadedFile() audioFile: Express.Multer.File ,@Req() Dto:any) {
    let record =  ""

    if(audioFile){
       record =  audioFile.filename
     }
     const teacher:User = Dto.user as User; 
     let user= teacher.id

     let content =  createSolutionDto.content
     let id =  createSolutionDto.id


     const data = await this.solutionService.create({content,record,id,user})
    return data
 
  }
  @Get('all')
  @UseGuards(JwtGuard)

  async all(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Req() Dto:any
) {
  const options = { page, limit };


      const queryBuilder =  await this.solutionService.getSolutions(options);
      return queryBuilder
  }

  @Get('')
  @UseGuards(JwtGuard)

  async getSolutionByData(
    @Query('dutiesId') dutiesId: number,
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Req() Dto:any
) {
  const options = { page, limit };
  const teacher:User = Dto.user as User; 
  let userId= teacher.id


      const queryBuilder =  await this.solutionService.getSolutionByData(userId,dutiesId,options);
      return queryBuilder
  }
  @Get('lesson')

  async getSolutionByLesson(
    @Query('lesson') lesson: number,
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
) {
  const options = { page, limit };


      const queryBuilder =  await this.solutionService.getSolutionByLesson({lesson,options});
      return queryBuilder
  }

}
