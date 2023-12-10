import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from 'src/typeorm/entities/subject';
import { Repository } from 'typeorm';
import { CreateSubjectDTO } from './dto/subjects.dto';
import { TeacherService } from 'src/teacher/teacher.service';
import { CategoryService } from 'src/category/category.service';
import { LevelsService } from 'src/levels/levels.service';
import { EducationalCycleService } from 'src/educational_cycle/educational_cycle.service';
import { Options, queryAndPaginate } from 'src/utility/helpers.utils';

@Injectable()
export class SubjectsService {
    constructor(
        @InjectRepository(Subject)  private subjectRepository: Repository<Subject>,
        private readonly TeacherService:TeacherService,
        private readonly CategoryService:CategoryService,
        private readonly LevelsService:LevelsService,
        private readonly EducationalCycleService:EducationalCycleService,

    ){}



    async createSubject(data:CreateSubjectDTO):Promise<Subject>{
        try {
            await this.LevelsService.findOne(data.Level.id)
            await this.CategoryService.findOne(data.Category.id)
            await this.TeacherService.findOne(data.teacher.id)
            await this.EducationalCycleService.findOne(data.cycle.id)
            return this.subjectRepository.save(data)
        } catch (error) {
            if(error.message){
                throw new BadRequestException(error.message)
            }
            throw new BadRequestException(error.message)  
        }
    }

    async findAll(options:Options){
        try {
            const queryBuild = await this.subjectRepository.createQueryBuilder('Subject')
            .leftJoinAndSelect('Subject.Level', 'Level')
            .leftJoinAndSelect('Subject.Category', 'Category')
            .leftJoinAndSelect('Subject.cycle', 'cycle')
            .leftJoinAndSelect('Subject.teacher', 'teacher')
            .leftJoinAndSelect('Subject.lessons', 'lessons')
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
            if(error.message){
                throw new BadRequestException(error.message)
            }
            throw new BadRequestException(error.message)  

            
        }
        
    }
    async findByEducationAndLevel(options:Options ,idCategory:number,IdEducation:number){
        try {
            const queryBuild = await this.subjectRepository.createQueryBuilder('Subject')
            .leftJoinAndSelect('Subject.Level', 'Level')
            .leftJoinAndSelect('Subject.Category', 'Category')
            .leftJoinAndSelect('Subject.cycle', 'cycle')
            .leftJoinAndSelect('Subject.teacher', 'teacher')
            .leftJoinAndSelect('Subject.lessons', 'lessons')
            .where("cycle.id = :IdEducation",{IdEducation})
            //.andWhere("Category.id = :idCategory" ,{idCategory})
            .select('Subject')
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
            if(error.message){
                throw new BadRequestException(error.message)
            }
            throw new BadRequestException(error.message)  

            
        }
        
    }
    async findOneByd(id:number){
        try {
            const existingSubject = await this.subjectRepository.createQueryBuilder('Subject')
            .leftJoinAndSelect('Subject.Level', 'Level')
            .leftJoinAndSelect('Subject.Category', 'Category')
            .leftJoinAndSelect('Subject.cycle', 'cycle')
            .leftJoinAndSelect('Subject.lessons', 'lessons')
            .leftJoinAndSelect('Subject.teacher', 'teacher')
            .where('Subject.id = :id', { id })
            .getOne(); 
            if (!existingSubject) {
              throw new NotFoundException('Subject not found');
            }
            return existingSubject
            
        } catch (error) {
            if(error.message){
                throw new BadRequestException(error.message)
            }
            throw new BadRequestException(error.message)  

            
            
        }
    }

    async updateSubject(id: number, data: CreateSubjectDTO): Promise<Subject> {
        try {
          await this.LevelsService.findOne(data.Level.id);
          await this.CategoryService.findOne(data.Category.id);
          await this.TeacherService.findOne(data.teacher.id);
          await this.EducationalCycleService.findOne(data.cycle.id);
    
          const existingSubject = await this.findOneByd(id);
    
          const updatedSubject = Object.assign(existingSubject, data);
          return this.subjectRepository.save(updatedSubject);
        } catch (error) {
          if (error.message) {
            throw new BadRequestException(error.message);
          }
          throw new BadRequestException(error.message);
        }
      }
    
      async deleteSubject(id: number): Promise<void> {

        try {
            
            const existingSubject = await this.findOneByd(id);
            await this.subjectRepository.remove(existingSubject);
        } catch (error) {
            if (error.message) {
                throw new BadRequestException(error.message);
              }
              throw new BadRequestException(error.message);
            }
            
        }
      }

