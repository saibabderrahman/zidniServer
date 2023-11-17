import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../typeorm/entities/Order';
import { Between, Repository } from 'typeorm';
import { orderDto } from './dto';
import { Classes } from '../typeorm/entities/Classes';
import { User } from '../typeorm/entities/User';
import { userDto } from 'src/users/Dto';
import { Teacher } from '../typeorm/entities/Teacher';
import { InjectQueue } from '@nestjs/bull';
import { TRANSCODE_QUEUE } from '../constants';
import { Queue } from 'bull';
import { Balance} from '../typeorm/entities/Balance';



@Injectable()
export class OrderService {

    constructor (
        @InjectRepository(Order) private orderRepository: Repository<Order>,
        @InjectRepository(Classes) private ClassRepository: Repository<Classes>,
        @InjectRepository(User) private UserRepository: Repository<User>,
        @InjectRepository(Teacher) private TeacherRepository: Repository<Teacher>,
        @InjectRepository(Balance) private BalanceRepository: Repository<Balance>,
        @InjectQueue(TRANSCODE_QUEUE) private readonly transcodeQueue: Queue,

    ){}

    async createOrder(dto){
        const ClassOrder = await this.ClassRepository.findOne({relations: ['teacher', 'student']  ,where:{ id:dto.class}})
        try {
            if(!ClassOrder){
                throw new ForbiddenException('this class not exist')
            }
            if (!ClassOrder.WaitingConfirmation) {
                ClassOrder.WaitingConfirmation = []; 
              }
              const existUser = ClassOrder.WaitingConfirmation.find((user)=>Number(user )=== Number(dto.user) ) 
              if(existUser){
                if(ClassOrder.seatsTotal === 0){
                    throw new ForbiddenException('انت في قائمة الإنتضار في حالة وجود مقع شاغر سنتصل بك ')
                }
                throw new ForbiddenException('انت الأن في قائمة الإنتضار الرجاء التقرب من المِؤسسة لدفع حقوق التسجيل')
            }
                           
            if(ClassOrder.seatsTotal === 0){
                throw new ForbiddenException('this class ic empty you can not signin on it')
            }
            const { priceTotal , TeacherPrice, schoolPrice  } = ClassOrder
            const teacher = ClassOrder.teacher.id
            if( priceTotal && TeacherPrice && schoolPrice && teacher && dto.user){
                dto.priceTotal =priceTotal
                dto.TeacherPrice =TeacherPrice
                dto.schoolPrice =schoolPrice
                dto.teacher = teacher
                dto.Class = dto.class
                dto.expiring = ClassOrder.coures
                const user = await this.UserRepository.findOne({where:{id:dto.user}})
                ClassOrder.WaitingConfirmation.push(dto.user);
                ClassOrder.student.push(user);
                const order = await this.orderRepository.create(dto)
                await this.orderRepository.save(order)
                await this.ClassRepository.save(ClassOrder)
                return {order:"success" , message:"لفد تم تسجيلك بنجاح  يرجى منكم التقرب إلي المِؤسسة في اقرب وقت لدفع حقوق الإشتراك"}
            }
            return { message:"something not correct you can not signin in this group right now  "}

        } catch (error) {
            console.log(error)
            if(error.sqlMessage){
              return error.sqlMessage
            }
            return error.message
        }
    } 
        
    async  getClassOrder(classId: number) {
        return this.ClassRepository.findOne({ relations: ['teacher', 'student'], where: { id: classId } });
    }

    async  createOrderForUser(userId: number, classOrder: Classes ,teacher:Teacher) {
        const existUser = classOrder.studentIds.find((user) => Number(user) === Number(userId));
        if (existUser) {
            return null;
        }else{
            const { priceTotal, TeacherPrice, schoolPrice } = classOrder;
            const teacherId = classOrder.teacher.id;
            if (priceTotal && TeacherPrice && schoolPrice && teacherId && userId) {
                const user = await this.UserRepository.findOne({ where: { id: userId } });
                if (!user) {
                    throw new Error(`User with ID ${userId} not found.`);
                }
                const order = new Order();
                order.user = user;
                order.status = "paid";
                order.priceTotal = priceTotal;
                order.TeacherPrice = TeacherPrice;
                order.schoolPrice = schoolPrice;
                order.teacher = teacher;
                order.Class = classOrder;
                order.expiring = classOrder.coures;
                classOrder.studentIds.push(user.id);
                await this.orderRepository.save(order);    
                return order;
            }
        }
        return null;
    }
  
      
    async createOrders(data: { ids: number[], class: number }) {
        try {
          const classOrder = await this.getClassOrder(data.class);
          const Teacher = await this.TeacherRepository.findOne({ where: { id: classOrder.teacher.id } });
      
          if (!classOrder) {
            throw new ForbiddenException('This class does not exist');
          }
      
          // Use the transaction method to wrap all the operations in a single transaction
          const result = await this.ClassRepository.manager.transaction(async transactionalEntityManager => {
            // Use Promise.all to parallelize the creation of orders
            const orders = await Promise.all(
              data.ids.map(async (id) => {
                return this.createOrderForUser(id, classOrder, Teacher);
              })
            );
      
            // Filter and count successful orders
            const successOrders = orders.filter((order) => order !== null);
            const successOrderCount = successOrders.length;
      
            if (successOrderCount === 0) {
              throw new ForbiddenException("all this users are exist");
            }
      
            // Save the classOrder after all the operations are complete
             const Class =  await transactionalEntityManager.save(classOrder);
      
            return { success: true,Class };
          });
      
          return result;
        } catch (error) {
          throw error;
        }
      }
      
      
    

    
    
    
    async PAidOrderCash(id:number){
        try {
                const order =  await this.orderRepository.findOne({where:{id} ,relations:['Class' ,"user"]})
                if(!order){
                    throw new ForbiddenException('this user not exist')
                }
                order.Class.seatsAvailable = order.Class.seatsAvailable - 1

                order.Class.WaitingConfirmation = order.Class.WaitingConfirmation.filter((el)=>Number(el) !== Number(order.user.id))

                if(!order.Class.studentIds){
                    order.Class.studentIds = []
                }
                order.Class.studentIds.push(order.user.id)
                await this.ClassRepository.save(order.Class)
                if(!order.user.Classes){
                    order.user.Classes= []
                }
                order.user.Classes.push(order.Class)
                await this.UserRepository.save(order.user)
                order.status = "paid"
                return this.orderRepository.save(order)
        } catch (error) {
            console.log(error)

            if(error.sqlMessage){
                return error.sqlMessage
              }
              return error.message  
        }
    }
    
    async findByIdClass(id:number){
        try {
            const Class = await this.ClassRepository.findOne({where:{id},relations:["teacher","Category","Level"],})
            const orders =  await this.orderRepository.find({relations:["Class" ,"user","Attendance"],
            where: {
                Class: {
                    id: id ,
                }
            }})

            return {orders,success:true,Class}

            
        } catch (error) {
            console.log(error)
            if(error.sqlMessage){
                return error.sqlMessage
              }
              return error.message  
        }
    }

    async findAllOrder (){
        try {
            const orders = await this.orderRepository.find({relations: ["balance","teacher"] ,where:{ type:"cash"}})
            return orders
        } catch (error) {
            console.log(error)
            if(error.sqlMessage){
                return error.sqlMessage
              }
              return error.message              
        }
    }
    async findOneByiD (id:number){
        try {
            const order = await this.orderRepository.findOne({relations: ["teacher","user","Class"] ,where:{id}})
            return {order,success:true}
        } catch (error) {
            console.log(error)
            if(error.sqlMessage){
                return error.sqlMessage
              }
              return error.message              
        }
    }
    async findAllOrderPaidCashToday (){
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

        try {
            const orders = await this.orderRepository.find({where:{ type:"cash" ,status:"paid",
            updatedAt: Between(startOfToday, endOfToday)
        }})
            return {orders, success:true }
        } catch (error) {
            console.log(error)
            if(error.sqlMessage){
                return error.sqlMessage
              }
              return error.message              
        }
    }
    async endOrder (id:number){
        try {
            const order = await this.orderRepository.findOne({where:{id},relations:["teacher","user","Class"]})
            if(!order){
                throw new ForbiddenException('this order not exist')
            }
              if(order.status === "end"){
                  throw new ForbiddenException('this order already updated exist')
              }
              if(order.status === "end"){
                throw new ForbiddenException('this order is not  is end already')
            }
              if(order.status === "notPaid"){
                 throw new ForbiddenException('this order is not  paid')
             }

            const teacher = await this.TeacherRepository.findOne({where:{id:order.teacher.id},relations:["balance"]})
            console.log({teacher})


            order.status= "end"

            if(teacher){

                teacher.availableBalance = Number(teacher.availableBalance) + Number(order.TeacherPrice)
                 const balance =  teacher.balance.find((el)=>el.status === "notWithdrawable")
                 console.log(balance)

                 if(!balance?.id){
                    console.log({teacher})
                    const data = {
                        priceTotal:order.TeacherPrice,
                    }
                    const Balan = await this.BalanceRepository.create(data)
                    order.balance = Balan
                    teacher.balance.push(Balan)
                    await this.orderRepository.save(order)
                    await this.BalanceRepository.save(Balan)
                    await this.TeacherRepository.save(teacher)
                    await this.transcodeQueue.add({
                        to: order.user.email,
                        template: 'PaymentReminder',
                        subject:"Payment Reminder",
                        context : {
                          name: order.user.firstName + " " + order.user.lastName,
                          url:`${process.env.CLINET_URL}/class/${order.Class.id}`,
                          className:order.Class.name
                       },
                      });   
                      
                    return {success:true}
        
                 }else{
                    balance.priceTotal = balance.priceTotal + order.TeacherPrice
                    order.balance = balance
                    await this.orderRepository.save(order)
                    await this.BalanceRepository.save(balance)
                    await this.TeacherRepository.save(teacher)
                    return {success:true}
                 }
            }else{
                return {success : false}
            }

            
        } catch (error) {
            console.log(error)
            if(error.sqlMessage){
                return error.sqlMessage
              }
              return error.message
            
        }

    }

    async renewalOrder(id:number){
        try {
            const order = await this.orderRepository.findOne({where:{id},relations:["teacher","Class","user"]})

            
            const data = {
                priceTotal :order.Class.priceTotal,
                TeacherPrice :order.Class.TeacherPrice,
                schoolPrice :order.Class.schoolPrice,
                teacher :order.teacher,
                Class :order.Class,
                expiring :order.Class.coures,
                user:order.user,
                status:"paid"
            }
            order.status = "renewal"
            await this.orderRepository.save(order)
            const newOrder = await this.orderRepository.create(data)
            await this.orderRepository.save(newOrder)
            return{success:true , order}
            
        } catch (error) {
            console.log(error)
            if(error.sqlMessage){
                return error.sqlMessage
              }
              return error.message  
            
        }


    }
}
