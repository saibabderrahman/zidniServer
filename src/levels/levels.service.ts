import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Levels } from '../typeorm/entities/Levels';
import { Repository } from 'typeorm';
import { LevelInterface } from './interface';
import { Options, queryAndPaginate } from 'src/utility/helpers.utils';

@Injectable()
export class LevelsService {
    constructor( @InjectRepository(Levels) private levelRepository: Repository<Levels>){}
    
    async createLevel(Dto: LevelInterface){
        try {
            const Level = await this.levelRepository.create(Dto)
         
            return this.levelRepository.save(Level)
        } catch (error) {
            return { message: error.message ,success:true }
        }  
    }
    async findLevel(options:Options){
        try {
          //  const Level = await this.levelRepository.find({ relations: ['LevelClasses']})
            const queryBuild = await this.levelRepository.createQueryBuilder('Levels')
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
            const Level = await this.levelRepository.findOne({  relations: ['LevelClasses'] ,where:{id}})
            return Level
        } catch (error) {
            return error.message
        }  
    }
    async findByCategory(id: number) {
        try {
            const category = await this.levelRepository.createQueryBuilder('category')
                .leftJoinAndSelect('category.LevelClasses', 'lc')
                .leftJoinAndSelect('lc.Category', 'lcCategory')
                .leftJoinAndSelect('lc.teacher', 'lcTeacher')
                .select(["category", "lc" ,"lcTeacher"])
                .where('lcCategory.id = :id', { id })
                .getMany();
    
            return category;
        } catch (error) {
            return error.message;
        }
    }
    
    async updateOne(id: number, dto: LevelInterface) {
        try {
          const Level = await this.levelRepository.findOne({where:{id}});
          if (!Level) {
            // Level with the specified id not found
            return null;
          }
          // Modify the properties of the Level with the updated values
          Level.name = dto.name;
          Level.slug = dto.slug;
      
          // Save the modified Level back to the database
          const updatedLevel = await this.levelRepository.save(Level);
      
          return updatedLevel;
        } catch (error) {
          return error.message;
        }
      }

}
