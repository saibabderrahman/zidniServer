import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../typeorm/entities/Category';
import { Repository } from 'typeorm';
import { CategoryInterface } from './interface';
import { FindManyOptions } from 'typeorm';
import { Options, queryAndPaginate } from 'src/utility/helpers.utils';



@Injectable()
export class CategoryService {
    constructor( @InjectRepository(Category) private categoryRepository: Repository<Category>){}


    async createCategory(Dto:CategoryInterface){
        try {
            const Category = await this.categoryRepository.create(Dto)
            return this.categoryRepository.save(Category )
        } catch (error) {
            return error.message
        }  
    }
    async findCategory(options:Options){
        try {
           // const Category = await this.categoryRepository.find({ relations: ['catClasses']})
           // return Category
            const queryBuild = await this.categoryRepository.createQueryBuilder('Category')
            //.leftJoinAndSelect('Educational_cycle.orders', 'orders')
            const { limit , page } = options;
            const offset = (page - 1) * limit || 0;
            const { totalCount, hasMore, data } = await queryAndPaginate(queryBuild, offset, limit);
    
            return {
                page: options.page || 1,
                limit: limit,
                totalCount: totalCount,
                data: data,
                hasMore: hasMore,
              }; 
        } catch (error) {
            return error.message
        }  
    }
    async findOne(id:number){
        try {
            const Category = await this.categoryRepository.findOne({  relations: ['catClasses'] ,where:{id}})
            return Category
        } catch (error) {
            return error.message
        }  
    }
    async findByLevel(id: number) {
        try {
      
            const category = await this.categoryRepository.createQueryBuilder('category')
      .leftJoinAndSelect('category.catClasses', 'catClasses')
      .leftJoinAndSelect('catClasses.Level', 'Level')
      .leftJoinAndSelect('catClasses.teacher', 'teacher') 
      .where('Level.id = :id', { id })
      .getMany();
            return category;
        } catch (error) {
            return error.message;
        }
    }
    
    
    async updateOne(id: number, dto: CategoryInterface) {
        try {
          const category = await this.categoryRepository.findOne({where:{id}});
          if (!category) {
            // Category with the specified id not found
            return null;
          }
          // Modify the properties of the category with the updated values
          category.name = dto.name;
          category.slug = dto.slug;
      
          // Save the modified category back to the database
          const updatedCategory = await this.categoryRepository.save(category);
      
          return updatedCategory;
        } catch (error) {
          return error.message;
        }
      }
}
