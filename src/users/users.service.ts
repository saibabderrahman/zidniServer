import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { User} from '../typeorm/entities/User';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { TRANSCODE_QUEUE } from '../constants';
import { JwtService } from '@nestjs/jwt';
import { Queue } from 'bull';
import { userDto } from './Dto';
import { EducationalCycleDTO } from 'src/educational_cycle/dto/EducationalCycleDTO';
import { Educational_cycle } from 'src/typeorm/entities/Educational_cycle';
import { AcaOrderDto } from 'src/aca-order/dto/AcaOrderDto ';
import { AcaOrder } from 'src/typeorm/entities/acaOrders';
import { Options, queryAndPaginate } from 'src/utility/helpers.utils';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectQueue(TRANSCODE_QUEUE) private readonly transcodeQueue: Queue,
        private jwtService: JwtService  ) {}
    
      public async Createstudent (dto:userDto){  
        try {
          const student = await this.usersRepository.findOne({where:{email:dto.email}})
          if (student){
            if(student.active){
              const access_token = await this.userSingin(student.id , student.email)
              await this.transcodeQueue.add({
                to: student.email,
                template: 'email',
                subject:"activation your account",
                context : {
                  name: student.firstName + " " + student.lastName,
                  token:`http://localhost:5000/api/v1/${access_token.access_token}`,
               },
              });   
             }else{
               throw new ForbiddenException('this user  exist try other email please')
  
             }
  
          } else{
              const Student = await this.usersRepository.create({...dto})
              const access_token = await this.userSingin(Student.id , Student.email)
              const savedStudent = await this.usersRepository.save(Student);
                     await this.transcodeQueue.add({
               to: Student.email,
               template: 'email',
               subject:"activation your account",
               context : {
                name: Student.firstName + " " + Student.lastName,
                token:`http://localhost:5000/api/v1/${access_token.access_token}`,
              },
             });   
              return { student: savedStudent, access_token };
          }    
      } catch (error) {
        console.log(error)
        if(error.sqlMessage){
          return error.sqlMessage
        }
        return error
      }

    } 
    public async Login (Dto){
      try {
          const student = await this.usersRepository.findOneBy({email:Dto.email})
          if(!student){
              throw new ForbiddenException('this user is not exist try other email please')
          }else{
              const isMatch =  await student.comparePassword(Dto.password)
              if(isMatch){
                  const access_token = await this.userSingin(student.id , student.email)
                  return { student, token: access_token.access_token }
              }
              throw new ForbiddenException('password not correct ')}   
      } catch (error) {
          return error.message    
      }
    }
    public async findOne(id: any) {
      try {
        const student = await this.usersRepository.findOne({ where:{  id}} ,  );
        return student;
      } catch (error) {
        return error.message;
      }
    }

    async findAll(options:Options) {
      
      try {
        const queryBuild = await this.usersRepository.createQueryBuilder('User')
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


    async createFromOrder(dto:AcaOrder ,educational_cycle:Educational_cycle){
      try {
        const data =  await this.createOrderAndUser(dto)

        console.log(data.password)
        const student = await this.usersRepository.findOne({where:{email:data.email}})
        if(student){
            return await this.usersRepository.save(student)
          }{
            const student = await this.usersRepository.findOne({where:{phoneNumber:data.phoneNumber}})

            if(student){
              throw new BadRequestException('phone number exist')
            }
            const user = await this.usersRepository.create(data)
           return await this.usersRepository.save(user)
        }
      } catch (error) {
        if(error.message){
          throw new BadRequestException(error.message)
        }
        throw new BadRequestException(error)
        
      }

    }


    async remove(id: number): Promise<void> {
      await this.usersRepository.delete(id);
    }
    public async AdminCreateStudent (dto:userDto){  
      try {
        const student = await this.usersRepository.findOne({where:{email:dto.email}})
        if (student){
           if(student.active){
            const access_token = await this.userSingin(student.id , student.email)
            await this.transcodeQueue.add({
              to: student.email,
              template: 'email',
              subject:"activation your account",
              context : {
                name: student.firstName + " " + student.lastName,
                token:`http://localhost:5000/api/v1/${access_token.access_token}`,
             },
            });   
           }else{
             throw new ForbiddenException('this user  exist try other email please')

           }
        } else{
            const Student = await this.usersRepository.create({...dto , active:true})
            const access_token = await this.userSingin(Student.id , Student.email)
            const savedStudent = await this.usersRepository.save(Student);
                   await this.transcodeQueue.add({
             to: Student.email,
             template: 'email',
             subject:"activation your account",
             context : {
              name: Student.firstName + " " + Student.lastName,
              token:`http://localhost:5000/api/v1/${access_token.access_token}`,
            },
           });   
            return { student: savedStudent, access_token };
        }    
    } catch (error) {
      console.log(error)
      if(error.sqlMessage){
        return error.sqlMessage
      }
      return error
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

    private generateRandomPassword (length: number = 10) {
      const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let password = '';
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
      }
      console.log(password)
      return password;
    }

    public async createOrderAndUser(order: AcaOrder): Promise<userDto> {
      const password = this.generateRandomPassword();
        const user: userDto = {
        firstName: order.firstName,
        lastName: order.lastName,
        email: order.email,
        password: password, 
        phoneNumber: +order.phoneNumber, 
        avatar: "", 
        address: '', 
        zipCode: 0, 
        gender: order.gender, 
        dateOfBirth: order.dateOfBirth,
        educationLevel: order.educationLevel,
        memorizationValue: order.memorizationValue,
        fatherName: order.fatherName,
        school: order.school,
      };
  
      return user;
    }
  
}
