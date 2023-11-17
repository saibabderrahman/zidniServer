import { Controller, Post,Res , Body, Get, Param, Put, Query, ParseIntPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Response } from 'express';
import { CategoryDto } from './Dto';
var slugify = require('slugify')


@Controller('category')
export class CategoryController {
    constructor(private categoryService:CategoryService){}

    @Post("/")
    async createCategory(@Res() res:Response , @Body() dto:CategoryDto){
        const name:string = dto.name
        const slug = slugify(name, { replacement: '-', remove: undefined,lower: false,strict: false, locale: 'vi', trim: true })
        const category = await this.categoryService.createCategory({name, slug}) 
        res.status(201).json(category)
    }

    @Get('')
    async findAll(
        @Query('page', ParseIntPipe) page = 1,
        @Query('limit', ParseIntPipe) limit = 10,

    ){
        const options = { page, limit };

        const categories = await this.categoryService.findCategory(options)
        return categories
    }
    @Get(':id')
    async findOneById(@Param('id') id: number){
        const category = await this.categoryService.findOne(id)
        return category
    }
    @Get('level/:id')
    async findOneByLevel(@Param('id') id: number){
        const category = await this.categoryService.findByLevel(id)
        return category
    }
    @Put(':id')
    async updateById(@Param('id') id: number ,@Body() dto:CategoryDto){
        const name:string = dto.name
        const slug = slugify(name, { replacement: '-', remove: undefined,lower: false,strict: false, locale: 'vi', trim: true })
        const category = await this.categoryService.updateOne(id,{name, slug}) 
        return category
    }
}
