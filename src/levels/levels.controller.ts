import { Controller, Post,Res , Body, Get, Param, Put, Query, ParseIntPipe } from '@nestjs/common';
import { Response } from 'express';
import { LevelDto } from './Dto';
import { ParamsTokenFactory } from '@nestjs/core/pipes';
import { LevelsService } from './levels.service';
var slugify = require('slugify')


@Controller('levels')
export class LevelsController {
    constructor(private LevelService:LevelsService){}

    @Post("/")
    async createLevel(@Res() res:Response , @Body() dto:LevelDto){
        const name:string = dto.name
        const slug = slugify(name, { replacement: '-', remove: undefined,lower: false,strict: false, locale: 'vi', trim: true })
        const Level = await this.LevelService.createLevel({name, slug}) 
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
        const Level = await this.LevelService.updateOne(id,{name, slug}) 
        return Level
    }

}
