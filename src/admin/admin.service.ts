import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from '../typeorm/entities/Teacher';
import {  Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectQueue } from '@nestjs/bull';
import { TRANSCODE_QUEUE } from '../constants';
import { Queue } from 'bull';
import { Classes } from '../typeorm/entities/Classes';
import { Category } from '../typeorm/entities/Category';
import { Levels } from '../typeorm/entities/Levels';
import { Order } from '../typeorm/entities/Order';
import { User } from '../typeorm/entities/User';
import { Admin } from '../typeorm/entities/Admin';
import { AdminInterface } from './interfac/admin.interface';
import { ClassesDto } from '../classe/dto/classes.dto';


@Injectable()
export class AdminService {
    constructor(
        @InjectQueue(TRANSCODE_QUEUE) private readonly transcodeQueue: Queue,
        @InjectRepository(Admin) private AdminRepository: Repository<Admin>,
        @InjectRepository(Teacher) private teacherRepository: Repository<Teacher>,
        @InjectRepository(User) private usersRepository: Repository<User>,
        @InjectRepository(Levels) private levelRepository: Repository<Levels>,
        @InjectRepository(Category) private categoryRepository: Repository<Category>,
        @InjectRepository(Classes)  private classRepository: Repository<Classes>,
        @InjectRepository(Order) private orderRepository: Repository<Order>,
        private jwtService: JwtService
    ) {}
    public async Createadmin (dto:AdminInterface){  
        try {
          const admin = await this. AdminRepository.findOne({where:{email:dto.email}})
          if (admin){
              if(admin.active === false){
                const access_token = await this.userSingin(admin.id , admin.email)
                await this.transcodeQueue.add({
                  to: admin.email,
                  template: 'email',
                  subject:"activation your account",
                  context : {
                    name: admin.firstName + " " + admin.lastName,
                    token:`http://localhost:5000/api/v1/${access_token.access_token}`,
                 },
                });   
                
                throw new ForbiddenException('you already have an account, we sent you an email to activate your account')
              }
              throw new ForbiddenException('this user  exist try other email please')
          } else{
              const admin = await this. AdminRepository.create({...dto})
              
              const access_token = await this.userSingin(admin.id , admin.email)
              const savedadmin = await this. AdminRepository.save(admin);
                     await this.transcodeQueue.add({
               to: admin.email,
               template: 'email',
               subject:"activation your account",
               context : {
                name: admin.firstName + " " + admin.lastName,
                token:`http://localhost:5000/api/v1/${access_token.access_token}`,
              },
             });   
              return { admin: savedadmin, access_token };
          }    
      } catch (error) {
        if(error.sqlMessage){
          return error.sqlMessage
        }
        return error.message

      }
    } 
    public async Login (Dto){

      try {
          const admin = await this. AdminRepository.findOneBy({email:Dto.email})

          if(!admin){
              throw new ForbiddenException('this user is not exist try other email please')
          }else{
              const isMatch =  await admin.comparePassword(Dto.password)
              if(isMatch){
                  const access_token = await this.userSingin(admin.id , admin.email)
                  return { admin, token: access_token.access_token }

              }
              throw new ForbiddenException('password not correct ')}   
      } catch (error) {
          return error.message    
      }
    }
    public async findOne(id: any) {
      try {
        const admin = await this. AdminRepository.findOne({where:{
          id
        }} ,  );
        return admin;
      } catch (error) {
        return error.message;
      }
    }



    public async initialsData(){
        try {
          const classes = await this.classRepository.find({ relations: ['teacher', 'Level', 'Category'], order: { id: 'DESC' } });
          const orders = await this.orderRepository.find({ relations: ['teacher', 'user', 'Class'], order: { id: 'DESC' } });
          const teachers = await this.teacherRepository.find({ relations: ['classes', 'balance'], order: { id: 'DESC' } });
          const users = await this.usersRepository.find({ relations: ['orders'], order: { id: 'DESC' } });
          const categories = await this.categoryRepository.find({ relations: ['catClasses'], order: { id: 'DESC' } });
          const levels = await this.levelRepository.find({ relations: ['LevelClasses'], order: { id: 'DESC' } });
          const admins = await this.AdminRepository.find({ order: { id: 'DESC' } });            
            return { classes, levels, teachers, admins, users, orders, categories };
        } catch (error) {
            ;
            if (error.sqlMessage) {
                return error.sqlMessage;
            }
            return error.message;
        }
    }

    public async CreateClass (dto:ClassesDto){
      const { name, description, benefit, Category, Level, start, end, day, time  ,priceTotal,coures ,seatsTotal,teacher} = dto;
      try {
        const className = {
          name, description, benefit, Category, Level, start, end, day, time ,priceTotal,seatsTotal,teacher,coures,
          TeacherPrice:priceTotal,
          schoolPrice:Number(priceTotal) * (benefit / 100),
          show:true
        }
      className.TeacherPrice = Number(className.priceTotal) - className.schoolPrice;
      const data = await this.classRepository.create(className)
      await this.classRepository.save(data)
      return {success :true , data}
      } catch (error) {
        ;
        if (error.sqlMessage) {
            return error.sqlMessage;
        }
        return error.message;

        
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
