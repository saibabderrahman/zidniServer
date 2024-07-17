import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Educational_cycle } from 'src/typeorm/entities/Educational_cycle';
import { Repository } from 'typeorm';
import { EducationalCycleDTO } from './dto/EducationalCycleDTO';
import { handleError, Options, queryAndPaginate } from 'src/utility/helpers.utils';
import { TypeEducationService } from 'src/type_education/type_education.service';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from 'src/logger.service';

@Injectable()
export class EducationalCycleService {
    constructor(@InjectRepository(Educational_cycle) private readonly educationRepository: Repository<Educational_cycle>,
    private readonly TypeEducation:TypeEducationService,
    private readonly configService:ConfigService,
    private readonly logger:LoggerService,



    ) {}

    async create(data: EducationalCycleDTO): Promise<Educational_cycle> { 
    try {
        const type_Education =   await this.TypeEducation.findOne(data.type_Education)
        const educational_cycle = await this.educationRepository.create({...data,type_Education});
         const  newEducation =await this.educationRepository.save(educational_cycle);
        
        if(educational_cycle.token_bot_telegram){
            try {
                  const response = await  axios.get(`${this.configService.get("TELEGRAM_URL")}/bot${educational_cycle.token_bot_telegram}
                  /setwebhook?url=${this.configService.get("BACKEND")}/telegram?education=${newEducation.id}`)
            } catch (error) {
                throw new Error("Telegram TokenNotCorrect")
            }
            
        }
        return
    } catch (error) {
        handleError('Error in Create function', error,this.logger,"EducationalCycleServicey");    

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
        .leftJoinAndSelect('Educational_cycle.type_Education', 'type_Education')
        .orderBy('Educational_cycle.createdAt', 'DESC')

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
    async findFrontEnd(options:Options) {
        const queryBuild = await this.educationRepository.createQueryBuilder('Educational_cycle')
       // .leftJoinAndSelect('Educational_cycle.orders', 'orders')
        .leftJoinAndSelect('Educational_cycle.type_Education', 'type_Education')
        .where("Educational_cycle.status = true")
        .orderBy('Educational_cycle.createdAt', 'DESC')

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


    async hideOne(id:number):Promise<void>{
        try {
            const educational = await this.findOne(id)
            await this.educationRepository.save({...educational,status:!educational.status})
        } catch (error) {
            throw error
            
        }

    }

    async findOne(id: number): Promise<Educational_cycle> {
        const queryBuild = await this.educationRepository.createQueryBuilder('Educational_cycle')
        .leftJoinAndSelect('Educational_cycle.type_Education', 'type_Education')
        .select(["Educational_cycle","type_Education"])
        .where("Educational_cycle.id = :id" ,{id})
        //.andWhere("Educational_cycle.status = true" )
        .getOne()
        if (!queryBuild) {
            throw new NotFoundException(`الدورة التدريبية  غير موجودة`);
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
        try {
            
            const existingEducationalCycle = await this.findOne(id);
            const updatedEducationalCycle = Object.assign(existingEducationalCycle, data);
              const updated = await this.educationRepository.save(updatedEducationalCycle);


              if(updated.token_bot_telegram){
                try {
                   const response = await axios.get(`${this.configService.get("TELEGRAM_URL")}/bot${updated .token_bot_telegram}/setwebhook?url=${this.configService.get("BACKEND")}/telegram?education=${updated.id}`)
                } catch (error) {
                    throw new Error("Telegram TokenNotCorrect")
                }
                
            }
            return updated
        } catch (error) {
            handleError('Error in update function', error,this.logger,"EducationalCycleServicey");    

            
        }
    }

    async remove(id: number): Promise<void> {
        const existingEducationalCycle = await this.findOne(id);
        await this.educationRepository.remove(existingEducationalCycle);
    }
}
