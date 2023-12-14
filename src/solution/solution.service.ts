import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DutiesService } from 'src/duties/duties.service';
import { Solution } from 'src/typeorm/entities/solution';
import { UsersService } from 'src/users/users.service';
import { Options, queryAndPaginate } from 'src/utility/helpers.utils';
import { Repository } from 'typeorm';

@Injectable()
export class SolutionService {

    constructor(@InjectRepository(Solution) private SolutionRepository: Repository<Solution>,   
    private readonly DutiesService:DutiesService,
    private readonly UsersService:UsersService,
    ){}



    async create(data: { content: string, record: string, id: number, user: number }) {
        try {
            // Check if a solution with the same duties and user already exists
            const existingSolution = await this.SolutionRepository.findOne({
                where: { duties: { id: data.id }, user: { id: data.user } },
            });

            if (existingSolution) {
                throw new BadRequestException('لقد قمت بالفعل بتقديم حل لهذا الواجب');
            }

            const duties = await this.DutiesService.getDutyById(data.id);
            const user = await this.UsersService.findOne(data.user);
            const { record, content } = data;
            const solution = await this.SolutionRepository.create({ record, content, user, duties });
            return this.SolutionRepository.save(solution);
        } catch (error) {
            throw new BadRequestException(error.message || 'Failed to create solution.');
        }
    }
    async getSolutionById(id: number ){
        try {
            const queryBuilder = await this.SolutionRepository.findOne({where:{id},relations:["notes"]})

            if(!queryBuilder){
                throw new NotFoundException("this solution not exists")
            }
            return queryBuilder
        } catch (error) {

            throw new BadRequestException(error.message || 'Failed to create solution.');
        }
    }

    async getSolutionByData(userId: number, dutiesId: number, options:Options){
        try {
            const queryBuilder = this.SolutionRepository.createQueryBuilder('solution');
            queryBuilder
                .innerJoinAndSelect('solution.user', 'user')
                .innerJoinAndSelect('solution.duties', 'duties')
                
                if (userId) {
                    queryBuilder.where('user.id = :userId', { userId })
            } 
            
            if (dutiesId) {
                queryBuilder.andWhere('duties.id = :dutiesId', { dutiesId });
            }
            
            const { limit , page } = options;
            const offset = (page - 1) * limit || 0;
            const { totalCount, hasMore, data } = await queryAndPaginate(queryBuilder, offset, limit);

            return {
                page: options.page || 1,
                limit: limit,
                totalCount: totalCount,
                data: data,
                hasMore: hasMore,
              }; 
        } catch (error) {
            throw new BadRequestException(error.message || 'Failed to create solution.');
        }
    }

    async getSolutionByLesson( data:{lesson: number, options:Options}){



        const {lesson , options } = data
        try {
            const queryBuilder = await this.SolutionRepository.createQueryBuilder('solution');
            queryBuilder
                .innerJoinAndSelect('solution.user', 'user')
                .leftJoinAndSelect('solution.notes', 'notes')
                .innerJoinAndSelect('solution.duties', 'duties')
                .innerJoinAndSelect('duties.lesson', 'lesson')

                
                .where('lesson.id = :lesson', {lesson})
            
            const { limit , page } = options;
            const offset = (page - 1) * limit || 0;
            const { totalCount, hasMore, data } = await queryAndPaginate(queryBuilder, offset, limit);

            return {
                page: options.page || 1,
                limit: limit,
                totalCount: totalCount,
                data: data,
                hasMore: hasMore,
              }; 
        } catch (error) {
            throw new BadRequestException(error.message || 'Failed to create solution.');
        }
    }

}
