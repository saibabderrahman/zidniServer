import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Levels } from '../typeorm/entities/Levels';
import { Repository } from 'typeorm';
import { LevelInterface } from './interface';
import { Options, queryAndPaginate } from 'src/utility/helpers.utils';
import { TypeEducationService } from 'src/type_education/type_education.service';
import { EducationalCycleService } from 'src/educational_cycle/educational_cycle.service';
import { Duties } from 'src/typeorm/entities/duties';

@Injectable()
export class LevelsService {
    constructor( @InjectRepository(Levels) private levelRepository: Repository<Levels>,
    private readonly TypeEducation:TypeEducationService,
    private readonly education:EducationalCycleService,
    ){}
    
    async createLevel(Dto: LevelInterface){
        try {
            const type_Education =   await this.TypeEducation.findOne(Dto.type)

            const Level = await this.levelRepository.create({...Dto,type:type_Education})
         
            return this.levelRepository.save(Level)
        } catch (error) {
            return { message: error.message ,success:true }
        }  
    }
    async findLevel(options:Options){
        try {
            const queryBuild = await this.levelRepository.createQueryBuilder('Levels')
            .leftJoinAndSelect('Levels.type', 'type')
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
    async findLevelUser(data:{options:Options,education:number}){
        const {options,education}= data
        try {
            const existEducation = await this.education.findOne(education)

            const queryBuild = await this.levelRepository.createQueryBuilder('Levels')
            .leftJoinAndSelect('Levels.type', 'type')
            .where("type.id = :id",{id:existEducation.type_Education.id})
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
    async findOneuser(data: { id: number, user: number }) {
        const { id, user } = data;
    
        try {
            const level = await this.levelRepository.createQueryBuilder('level')
                .leftJoinAndSelect("level.type", "type")
                .leftJoinAndSelect("level.duties", "duties")
                .leftJoinAndSelect("duties.solutions", "solutions")
                .leftJoinAndSelect("solutions.user", "solutionUser")
                .where("level.id = :id", { id })
                .getOne();
    
            const updatedDuties = level.duties.map((item: Duties) => {
                const solution = item.solutions.find(s => Number(s.user.id) === Number(user));
                return { ...item, solutions: solution ? [solution] : [] };
            });

    
            level.duties = updatedDuties;
    
            return level;
        } catch (error) {
            throw new BadRequestException(error.message || error)        }
    }
    
    async findOne(id:number){
        try {
            const Level = await this.levelRepository.findOne({  relations: ['LevelClasses'] ,where:{id}})
            return Level
        } catch (error) {
            throw new BadRequestException(error.message || error)   
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
