import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from '../typeorm/entities/Teacher';
import { Repository } from 'typeorm';
import { TeacherInterface } from './interfac/teacher.interface';
import { JwtService } from '@nestjs/jwt';
import { InjectQueue } from '@nestjs/bull';
import { TRANSCODE_QUEUE } from '../constants';
import { Queue } from 'bull';
import { Options, queryAndPaginate } from 'src/utility/helpers.utils';




@Injectable()
export class TeacherService {
      constructor(
        @InjectQueue(TRANSCODE_QUEUE) private readonly transcodeQueue: Queue,
        @InjectRepository(Teacher) private teacherRepository: Repository<Teacher>,
        private jwtService: JwtService

      ) {}
      public async CreateTeacher (dto:TeacherInterface){  
          try {
            const teacher = await this.teacherRepository.findOne({where:{email:dto.email}})
            if (teacher){
                if(teacher.active === false){
                  const access_token = await this.userSingin(teacher.id , teacher.email)
                  await this.transcodeQueue.add({
                    to: teacher.email,
                    template: 'email',
                    subject:"activation your account",
                    context : {
                      name: teacher.firstName + " " + teacher.lastName,
                      token:`http://localhost:5000/api/v1/${access_token.access_token}`,
                   },
                  });   
                  
                  throw new ForbiddenException('you already have an account, we sent you an email to activate your account')
                }
                throw new ForbiddenException('this user  exist try other email please')
            } else{
                const Teacher = await this.teacherRepository.create({...dto})
                
                const access_token = await this.userSingin(Teacher.id , Teacher.email)
                const savedTeacher = await this.teacherRepository.save(Teacher);
                       await this.transcodeQueue.add({
                 to: Teacher.email,
                 template: 'email',
                 subject:"activation your account",
                 context : {
                  name: Teacher.firstName + " " + Teacher.lastName,
                  token:`http://localhost:5000/api/v1/${access_token.access_token}`,
                },
               });   
                return { teacher: savedTeacher, access_token };
            }    
        } catch (error) {
          if(error.sqlMessage){
            return error.sqlMessage
          }
          return error
  
        }
      } 
      public async Login (Dto){

        try {
            const Teacher = await this.teacherRepository.findOne({where:{email:Dto.email },relations:["balance"]})

            if(!Teacher){
                throw new ForbiddenException('this user is not exist try other email please')
            }else{
                const isMatch =  await Teacher.comparePassword(Dto.password)
                if(isMatch){
                    const access_token = await this.userSingin(Teacher.id , Teacher.email)
                    return { Teacher, token: access_token.access_token }

                }
                throw new ForbiddenException('password not correct ')}   
        } catch (error) {
            return error.message    
        }
      }
      public async findOne(id: any) {
        try {
          const teacher = await this.teacherRepository.findOne({ relations: ['classes' ,"balance","orders"] ,where:{
            id,
          },} 
            );
          return teacher;
        } catch (error) {
          return error.message;
        }
      }

      async findAll (options:Options){
        try {
          const queryBuild = await this.teacherRepository.createQueryBuilder('Teacher')
          .leftJoinAndSelect('Teacher.classes', 'classes')
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
          
        }
      }
      public async AdminCreate (dto:TeacherInterface){  
        try {
          const teacher = await this.teacherRepository.findOne({where:{email:dto.email}})
          if (teacher){
              if(teacher.active === false){
                const access_token = await this.userSingin(teacher.id , teacher.email)
                await this.transcodeQueue.add({
                  to: teacher.email,
                  template: 'email',
                  subject:"activation your account",
                  context : {
                    name: teacher.firstName + " " + teacher.lastName,
                    token:`http://localhost:5000/api/v1/${access_token.access_token}`,
                 },
                }) 
                throw new ForbiddenException('you already have an account, we sent you an email to activate your account')
              }
            throw new ForbiddenException('this user  exist try other email please')
          } else{
              const Teacher = await this.teacherRepository.create({...dto , active:true ,accepted:true})
              const access_token = await this.userSingin(Teacher.id , Teacher.email)
              const savedTeacher = await this.teacherRepository.save(Teacher);
               this.transcodeQueue.add({
               to: Teacher.email,
               template: 'email',
               subject:"activation your account",
               context : {
                name: Teacher.firstName + " " + Teacher.lastName,
                token:`http://localhost:5000/api/v1/${access_token.access_token}`,
              },
             });   
            return teacher;
          }    
      } catch (error) {
        throw new ForbiddenException(error)
     

      }
      } 
  
      async userSingin (id:number, email:string): Promise<{access_token:string}>{
         const payload = {
            sub : id,
            email
         }    

         const access_token = await this.jwtService.signAsync(payload)
        return{ access_token}
      }
}
