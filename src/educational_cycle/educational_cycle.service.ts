import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Educational_cycle } from 'src/typeorm/entities/Educational_cycle';
import { Repository } from 'typeorm';
import { EducationalCycleDTO } from './dto/EducationalCycleDTO';
import { Options, queryAndPaginate } from 'src/utility/helpers.utils';

@Injectable()
export class EducationalCycleService {
    constructor(@InjectRepository(Educational_cycle) private readonly educationRepository: Repository<Educational_cycle>) {}

    async create(data: EducationalCycleDTO): Promise<Educational_cycle> {
        
    try {
        const educational_cycle = await this.educationRepository.create(data);
        return await this.educationRepository.save(educational_cycle);
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
        .leftJoinAndSelect('Educational_cycle.orders', 'orders')



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
        const educational_cycle = await this.educationRepository.findOne({where:{id}});
        if (!educational_cycle) {
            throw new NotFoundException(`Educational_cycle with ID ${id} not found`);
        }
        return educational_cycle;
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
