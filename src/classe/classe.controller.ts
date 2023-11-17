import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { ClasseService } from './classe.service';
import { Request, Response } from 'express';
import { ClassesDto } from './dto/classes.dto';
import { JwtGuard } from '../teacher/Guard';
import { Teacher } from '../typeorm/entities/Teacher';

@Controller('classe')
export class ClasseController {
    constructor(private classService:ClasseService){}
    @UseGuards(JwtGuard)
    @Post("create")
    async CreateClass(@Res() res:Response , @Req() Dto:Request){
      const teacher:Teacher = Dto.user as Teacher; 
      Dto.body.teacher= teacher.id
      const data = await this.classService.createClass(Dto.body)
        res.status(201).json(data)
    }
    @Get("findOneById/:id")
    async findOneByID(@Param('id') id: number){
      return this.classService.findOne(id)
    }
    @Delete("DeleteOneById/:id")
    async DeleteOneByID(@Param('id') id: number){
      return this.classService.DeleteOne(id)
    }
    @Put("updateOne/:id")
    async update(@Res() res:Response  ,@Param('id') id: number ,@Body() dto:ClassesDto){
      const newClass= await this.classService.UpdateOne(id ,dto)
      if(newClass.show){
        res.status(200).send({newClass,message:"this groupe update successfully" })

      }else{
        res.status(400).send(newClass)

      }
    }

    @Get("all")
    async findAll(@Res() res: Response) {
      try {
        const data = await this.classService.findAll();
    
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
}
