import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Duties } from 'src/typeorm/entities/duties';
import { DutiesDTO } from './dto/DutiesDTO';
import { LessonService } from 'src/lesson/lesson.service';
import { Options, queryAndPaginate } from 'src/utility/helpers.utils';

@Injectable()
export class DutiesService {
  constructor(
    @InjectRepository(Duties) private readonly dutiesRepository: Repository<Duties>,
    private readonly LessonService:LessonService,

  ) {}

  async createDuty(dutiesDTO: DutiesDTO): Promise<Duties> {

    try {
        const lesson = await this.LessonService.findOneByID(dutiesDTO.lesson)

        if(!lesson){
          throw new ForbiddenException("not found ")


        }
       return await this.dutiesRepository.save({
        ...dutiesDTO,
        lesson,
      });
    } catch (error) {
        if (error.sqlMessage) {
            throw new ForbiddenException(error.sqlMessage)
         }
        throw new ForbiddenException(error.message)
    }
  }

  async getAllDuties(data:{options:Options,lesson:number}) {

    const {options ,lesson} = data
    try {
      const classesQuery =await this.dutiesRepository.createQueryBuilder("Duties")
      .leftJoinAndSelect('Duties.lesson',"lesson")
      .orderBy('Duties.createdAt', 'DESC')


      if(lesson){
        classesQuery.where('lesson.id = :lesson' ,{lesson})
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
  async getAllDutiesByUserID(options:Options ,id:number) {
    try {
      const classesQuery = await this.dutiesRepository.createQueryBuilder("Duties")
      .leftJoinAndSelect('Duties.lesson',"lesson")
      .leftJoinAndSelect("lesson.subject" ,"subject")
      .leftJoinAndSelect("subject.cycle","cycle")
      .leftJoinAndSelect("cycle.orders","orders")
      .leftJoinAndSelect("orders.user","user")
      .leftJoinAndSelect("Duties.solutions","solutions")
      .where("user.id = :id",{id})
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
