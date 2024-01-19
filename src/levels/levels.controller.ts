import { Controller, Post,Res , Body, Get, Param, Put, Query, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { Response } from 'express';
import { LevelDto } from './Dto';
import { JwtGuard } from 'src/users/Guard';
import { LevelsService } from './levels.service';
import { User } from 'src/typeorm/entities/User';
var slugify = require('slugify')


@Controller('levels')
export class LevelsController {
    constructor(private LevelService:LevelsService){}

    @Post("/")
    async createLevel(@Res() res:Response , @Body() dto:LevelDto){
        const name:string = dto.name
        const slug = slugify(name, { replacement: '-', remove: undefined,lower: false,strict: false, locale: 'vi', trim: true })
        const Level = await this.LevelService.createLevel({...dto,slug}) 
        res.status(201).json(Level)
    }

    @Get('/')
    async findAll(
        @Query('page', ParseIntPipe) page = 1,
        @Query('limit', ParseIntPipe) limit = 10,

    ){
        const options = { page, limit };

        const categories = await this.LevelService.findLevel(options)
        return categories
    }
    @Get('/user')
    @UseGuards(JwtGuard)


    async findAllUser(
        @Query('page', ParseIntPipe) page = 1,
        @Query('limit', ParseIntPipe) limit = 10,
        @Query('education', ParseIntPipe) education:number,

    ){


        const options = { page, limit };

        const categories = await this.LevelService.findLevelUser({options,education})
        return categories
    }
    @Get('user/:id')

    @UseGuards(JwtGuard)

    async findOneByIduser(@Param('id') id: number ,@Req() Dto:any){
        const teacher:User = Dto.user as User; 
        let user= teacher?.id

   
        const Level = await this.LevelService.findOneuser({id,user})
        return Level
    }
    @Get(':id')
    async findOneById(@Param('id') id: number){
        const Level = await this.LevelService.findOne(id)
        return Level
    }
    @Get('category/:id')
    async findOneByCategory(@Param('id') id: number){
        const category = await this.LevelService.findByCategory(id)
        return category
    }
    @Put(':id')
    async updateById(@Param('id') id: number ,@Body() dto:LevelDto){
        const name:string = dto.name
        const slug = slugify(name, { replacement: '-', remove: undefined,lower: false,strict: false, locale: 'vi', trim: true })
        const Level = await this.LevelService.updateOne(id,{...dto,slug}) 
        return Level
    }

}
