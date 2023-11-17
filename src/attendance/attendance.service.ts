import { ForbiddenException, Injectable } from '@nestjs/common';
import { Order } from '../typeorm/entities/Order';
import { Admin } from '../typeorm/entities/Admin';
import { Attendance } from '../typeorm/entities/Attendance';
import { Classes } from '../typeorm/entities/Classes';
import { User } from '../typeorm/entities/User';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DeepPartial, Repository } from 'typeorm';
import { Lesson } from '../typeorm/entities/Lesson';
import { AcaOrder } from 'src/typeorm/entities/acaOrders';
import { Subject } from 'src/typeorm/entities/subject';


@Injectable()
export class AttendanceService {
    constructor(    @InjectRepository(AcaOrder) private orderRepository: Repository<AcaOrder>,
    @InjectRepository(Attendance) private AttendanceRepository: Repository<Attendance>,
    @InjectRepository(Lesson) private LessonRepository: Repository<Lesson>,
    @InjectRepository(Subject) private ClassRepository: Repository<Subject>,
){}


      async create(data:{name:string,id:number ,subject:number}){
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
     
  
        try {
            const order = await this.orderRepository.findOne({  where:{id:data.id}})
            if(!order){
                throw new ForbiddenException('hi this order not exist')
            }
           const classLessen = await this.ClassRepository.findOne({relations:["lessons"] ,where:{
               id:data.subject,
               lessons:{
                   createdAt: Between(startOfToday, endOfToday)
               }
           }})

            if(!classLessen.lessons){
                throw new ForbiddenException('hi this Groups dos not have any new class  ')
            }

             const user={
                 state : data.name,
                 Lesson : classLessen.lessons[0].id,
                 user : order.user,
                 order : order
             }
             const Attendance = await this.AttendanceRepository.create(user)
             const att = await this.AttendanceRepository.save(Attendance)
            return {success :true ,att}
            
        } catch (error) {

            throw new ForbiddenException(error)
    
            
        }
      
      
      
          
      }

      async findAll(){
        try {
            const att = await this.AttendanceRepository.find({relations:["Lesson","order" ,"user"]})
            return att
        } catch (error) {
            return error
            
        }
      }

      
}
