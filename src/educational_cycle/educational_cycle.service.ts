import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Educational_cycle } from 'src/typeorm/entities/Educational_cycle';
import { Repository } from 'typeorm';
import { EducationalCycleDTO } from './dto/EducationalCycleDTO';
import { Options, queryAndPaginate } from 'src/utility/helpers.utils';
import { TypeEducationService } from 'src/type_education/type_education.service';

@Injectable()
export class EducationalCycleService {
    constructor(@InjectRepository(Educational_cycle) private readonly educationRepository: Repository<Educational_cycle>,
    private readonly TypeEducation:TypeEducationService,

    ) {}

    async create(data: EducationalCycleDTO): Promise<Educational_cycle> {
        
    try {
        const type_Education =   await this.TypeEducation.findOne(data.type_Education)
        const educational_cycle = await this.educationRepository.create({...data,type_Education});
        return await this.educationRepository.save(educational_cycle);
    } catch (error) {
        if (error.message) {
            throw new BadRequestException(error.message);
        } else {
            throw new BadRequestException(error);
        }
    }
    }
    async save(data: Educational_cycle): Promise<Educational_cycle> {
        
        try {

            return await this.educationRepository.save({...data});
        } catch (error) {
            if (error.message) {
                throw new BadRequestException(error.message);
            } else {
                throw new BadRequestException(error);
            }
        }
        }

    async findAll(options:Options) {
        const queryBuild = await this.educationRepository.createQueryBuilder('Educational_cycle')
       // .leftJoinAndSelect('Educational_cycle.orders', 'orders')
        .leftJoinAndSelect('Educational_cycle.type_Education', 'type_Education')
        .orderBy('Educational_cycle.id', 'DESC')

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
  

    }

    async findOne(id: number): Promise<Educational_cycle> {
        const queryBuild = await this.educationRepository.createQueryBuilder('Educational_cycle')
        .leftJoinAndSelect('Educational_cycle.subjects', 'subjects')
        .leftJoinAndSelect('Educational_cycle.type_Education', 'type_Education')
        .leftJoinAndSelect('subjects.lessons', 'lessons')
        .leftJoinAndSelect('subjects.Level', 'Level')
        .leftJoinAndSelect('subjects.teacher', 'teacher')
        .select(["Educational_cycle","type_Education"])
        .where("Educational_cycle.id = :id" ,{id})
        .getOne()
        if (!queryBuild) {
            throw new NotFoundException(`Educational_cycle with ID ${id} not found`);
        }
        return queryBuild;
    }
    async findOneStudent(id: number): Promise<Educational_cycle[]> {
        const queryBuild = await this.educationRepository.createQueryBuilder('Educational_cycle')
        .leftJoinAndSelect('Educational_cycle.orders', 'orders')
        .leftJoinAndSelect('orders.user', 'user')
        .leftJoinAndSelect('Educational_cycle.subjects', 'subjects')
        .select(['Educational_cycle' ,"subjects"])
        .where("user.id = :id" ,{id})
        .select(["Educational_cycle" ,"subjects"])
        .getMany()
        if (!queryBuild) {
            throw new NotFoundException(`Educational_cycle with ID ${id} not found`);
        }
        return queryBuild;
    }

    async update(id: number, data: Educational_cycle): Promise<Educational_cycle> {
        const existingEducationalCycle = await this.findOne(id);
        const updatedEducationalCycle = Object.assign(existingEducationalCycle, data);
        return await this.educationRepository.save(updatedEducationalCycle);
    }

    async remove(id: number): Promise<void> {
        const existingEducationalCycle = await this.findOne(id);
        await this.educationRepository.remove(existingEducationalCycle);
    }
}
