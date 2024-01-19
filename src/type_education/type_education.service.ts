import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Type_Education } from 'src/typeorm/entities/typeOfEducation';
import { Repository } from 'typeorm';
import { TypeEducationDto } from './dto/TypeEducationDto';
import { Options, queryAndPaginate } from 'src/utility/helpers.utils';

@Injectable()
export class TypeEducationService {

    constructor( 

        @InjectRepository(Type_Education)  private TypeRepository: Repository<Type_Education>,

    ){}


    async create(dto:TypeEducationDto){
        try {
            const exist = await this.TypeRepository.findOne({where:{name:dto.name}})
            if(exist){
                throw new BadRequestException('نوع من هذا الإسم موجود بالفعل')
            }
            const data = await this.TypeRepository.create(dto)
            return await this.TypeRepository.save(data)
        } catch (error) {
            throw new BadRequestException(error.message || error)
            
        }
    }

    async findAll(options:Options){
        try {
            const queryBuild = await this.TypeRepository.createQueryBuilder('type_Education')
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
    async findOne(id:number){
        try {
            const queryBuild = await this.TypeRepository.findOne({where:{id}})

            if(!queryBuild){
                throw new BadRequestException('not found')
            }

            return queryBuild
        } catch (error) {
            if(error.message){
                throw new BadRequestException(error.message)
            }
            throw new BadRequestException(error)  

            
        }
        
    }
    async update(dto:TypeEducationDto){
        try {
            const exist = await this.TypeRepository.findOne({where:{id:dto.id}})
            if(!exist){
                throw new BadRequestException('هذا النوع غير موجود')
            }
            Object.assign(exist,dto)
            return await this.TypeRepository.save(exist)
        } catch (error) {
            throw new BadRequestException(error.message || error)
            
        }
    }





}
