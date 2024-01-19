import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Duties } from 'src/typeorm/entities/duties';
import { DutiesDTO } from './dto/DutiesDTO';
import { LessonService } from 'src/lesson/lesson.service';
import { Options, queryAndPaginate } from 'src/utility/helpers.utils';
import { LevelsService } from 'src/levels/levels.service';

@Injectable()
export class DutiesService {
  constructor(
    @InjectRepository(Duties) private readonly dutiesRepository: Repository<Duties>,
    private readonly LessonService:LessonService,
    private readonly LevelService:LevelsService,

  ) {}

  async createDuty(dutiesDTO: DutiesDTO): Promise<Duties> {

    try {
      if(dutiesDTO.lesson){
        const lesson = await this.LessonService.findOneByID(dutiesDTO.lesson)
          return await this.dutiesRepository.save({
           name:dutiesDTO.name,description:dutiesDTO.description,
           lesson,
         })

         
        }
    if(dutiesDTO.level){
      const level = await this.LevelService.findOne(dutiesDTO.level)
      return await this.dutiesRepository.save({
        name:dutiesDTO.name,description:dutiesDTO.description,
        level,
      })

    }
    } catch (error) {
        if (error.sqlMessage) {
            throw new ForbiddenException(error.sqlMessage)
         }
        throw new ForbiddenException(error.message)
    }
  }

  async getAllDuties(data:{options:Options,lesson:number ,level:number}) {

    const {options ,lesson,level} = data
    try {
      const classesQuery =await this.dutiesRepository.createQueryBuilder("Duties")
      .leftJoinAndSelect('Duties.lesson',"lesson")
      .leftJoinAndSelect('Duties.level',"level")
      .leftJoinAndSelect('level.type',"type")
      .orderBy('Duties.createdAt', 'DESC')


      if(lesson){
        classesQuery.where('lesson.id = :lesson' ,{lesson})
      }
      if(level){
        classesQuery.andWhere('level.id = :level' ,{level})
      }
      const { limit , page } = options;
      const offset = (page - 1) * limit || 0;
      const { totalCount, hasMore, data } = await queryAndPaginate(classesQuery, offset, limit);
      return {
        page: options.page || 1,
        limit: limit,
        totalCount: totalCount,
        data: data,
        hasMore: hasMore,
      };   
    } catch (error) {
      if (error.sqlMessage) {
        throw new ForbiddenException(error.sqlMessage)
     }
    throw new ForbiddenException(error.message)
    }
  }
  async getAllDutiesByUserID(options: Options, id: number) {
    console.log(id);
    try {
      const dutiesQuery = await this.dutiesRepository.createQueryBuilder("Duties")
        .leftJoinAndSelect('Duties.lesson', 'lesson')
        .leftJoinAndSelect('lesson.subject', 'subject')
        .leftJoinAndSelect('subject.cycle', 'cycle')
        .leftJoinAndSelect('cycle.orders', 'orders')
        .leftJoin('Duties.solutions', 'solutions')
        .leftJoinAndSelect('solutions.user', 'solutionUser')
        .where('orders.user.id = :id', { id })
        .andWhere('solutionUser.id IS NULL OR solutionUser.id != :id', { id })
        .orderBy('Duties.createdAt', 'DESC')
        .select(['lesson', 'subject', 'Duties', 'solutions']);
  
      const { limit, page } = options;
      const offset = (page - 1) * limit || 0;
      const { totalCount, hasMore, data } = await queryAndPaginate(dutiesQuery, offset, limit);
  
      return {
        page: options.page || 1,
        limit: limit,
        totalCount: totalCount,
        data: data,
        hasMore: hasMore,
      };
    } catch (error) {
      console.error(error);
  
      if (error.sqlMessage) {
        throw new ForbiddenException(error.sqlMessage);
      }
  
      throw new ForbiddenException(error.message);
    }
  }
  
  
  async getAllDutiesByLessonID(options:Options ,id:number) {
    try {
      const classesQuery = await this.dutiesRepository.createQueryBuilder("Duties")
      .leftJoinAndSelect('Duties.lesson',"lesson")
      .leftJoinAndSelect("lesson.subject" ,"subject")
      .leftJoinAndSelect("subject.cycle","cycle")
      .leftJoinAndSelect("cycle.orders","orders")
      .leftJoinAndSelect("Duties.solutions","solutions")
      .where("lesson.id = :id",{id})
      .select(["lesson" ,"subject","Duties" ,"solutions"])
      const { limit , page } = options;
      const offset = (page - 1) * limit || 0;
      const { totalCount, hasMore, data } = await queryAndPaginate(classesQuery, offset, limit);
      return {
        page: options.page || 1,
        limit: limit,
        totalCount: totalCount,
        data: data,
        hasMore: hasMore,
      };   
    } catch (error) {
      if (error.sqlMessage) {
        throw new ForbiddenException(error.sqlMessage)
     }
    throw new ForbiddenException(error.message)
    }
  }

  async getDutyById(id: number): Promise<Duties> {
    const duty = await this.dutiesRepository.findOne({where:{id}});
    if (!duty) {
      throw new NotFoundException(`Duty with ID ${id} not found`);
    }
    return duty;
  }

  async updateDuty(id: number, dutiesDTO: DutiesDTO): Promise<Duties> {
    await this.getDutyById(id); // Check if duty exists
 //   await this.dutiesRepository.update(id, dutiesDTO);
    return await this.getDutyById(id); // Return the updated duty
  }

  async deleteDuty(id: number): Promise<void> {
    await this.getDutyById(id); // Check if duty exists
    await this.dutiesRepository.delete(id);
  }
}
