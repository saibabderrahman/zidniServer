import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AcaOrder } from 'src/typeorm/entities/acaOrders';
import { Repository } from 'typeorm';
import { AcaOrderDto } from './dto/AcaOrderDto ';
import {EducationalCycleService} from "../educational_cycle/educational_cycle.service"
import { UsersService } from 'src/users/users.service';
import { handleError, Options, queryAndPaginate } from 'src/utility/helpers.utils';
import { LoggerService } from 'src/logger.service';



@Injectable()
export class AcaOrderService {
  constructor(
    @InjectRepository(AcaOrder)
    private readonly acaOrderRepository: Repository<AcaOrder>,
    private readonly EducationalCycleService:EducationalCycleService,
    private readonly UsersService:UsersService,
    private readonly logger:LoggerService
  ) {}

  async createAcaOrder(orderDto: AcaOrderDto) {
    try {
      const educational_cycle = await this.EducationalCycleService.findOne(orderDto.educational_cycle)
      if (!educational_cycle) {
        throw new BadRequestException('الدورة التدريبية التي تريد المشاركة فيها غير موجودة')
      }
      if (educational_cycle.seatsAvailable === 0) {
        throw new BadRequestException('لا يوجد مقاعد متاحة في هذه الدورة')
      }  
      const NewOrder = {
        ...orderDto, price: educational_cycle.price, educational_cycle
      }
      return await this.acaOrderRepository.save(NewOrder);
    } catch (error) {
      handleError('Error in FindAll wilayats function', error,this.logger,"statesDelivery");    
    }
  }
  
  async calculateTotalPaidToday(): Promise<number> {
    try {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      const totalPaidToday = await this.acaOrderRepository
        .createQueryBuilder('order')
        .select('SUM(order.price)', 'totalPaid')
        .where('order.status = :status', { status: 'paid' })
        .andWhere('order.createdAt >= :today', { today })
        .getRawOne();

      return totalPaidToday.totalPaid || 0;
    } catch (error) {
      handleError('Error in calculateTotalPaidToday function', error,this.logger,"statesDelivery");    
    }
  }
  async calculateTotalPaidBetweenDates(startDate: Date, endDate: Date): Promise<number> {
    try {
      startDate.setUTCHours(0, 0, 0, 0);
      endDate.setUTCHours(23, 59, 59, 999);

      const totalPaidBetweenDates = await this.acaOrderRepository
        .createQueryBuilder('order')
        .select('SUM(order.price)', 'totalPaid')
        .where('order.status = :status', { status: 'paid' })
        .andWhere('order.createdAt >= :startDate', { startDate })
        .andWhere('order.createdAt <= :endDate', { endDate })
        .getRawOne();

      return totalPaidBetweenDates.totalPaid || 0;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAllAcaOrders(options:Options) {
    try {
      const queryBuild = await this.acaOrderRepository.createQueryBuilder('AcaOrder')
      .leftJoinAndSelect('AcaOrder.educational_cycle', 'educational_cycle')
      .leftJoinAndSelect('AcaOrder.user', 'user')
      .where("AcaOrder.active = false")
      .orderBy('AcaOrder.updatedAt', 'DESC');

  
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
      throw new BadRequestException(error) 

      
    }
  }

  async findAcaOrderById(id: number): Promise<AcaOrder> {
    const order = await this.acaOrderRepository.findOne({where:{id},relations:["educational_cycle" ,]});
    if (!order) {
      throw new NotFoundException(`AcaOrder with ID ${id} not found`);
    }
    return order;
  }
  async updateAcaOrder(id: number, orderDto: AcaOrderDto): Promise<AcaOrder> {
    const existingOrder = await this.findAcaOrderById(id);

    if(existingOrder.educational_cycle){
      await this.UsersService.createFromOrder(existingOrder,existingOrder.educational_cycle)

    }
   // this.acaOrderRepository.merge(existingOrder, orderDto);
    return await this.acaOrderRepository.save(existingOrder);
  }

  async deleteAcaOrder(id: number): Promise<void> {
    try {
      const existingOrder = await this.findAcaOrderById(id);
      existingOrder.active =true
      await this.acaOrderRepository.save(existingOrder);
    } catch (error) {
      throw new NotFoundException('AcaOrder is already paid or not found.');
    }
  }

  async acceptAcaOrder(id: number): Promise<AcaOrder> {
    try {
      const order = await this.findAcaOrderById(id);

      if (order.status === 'notPaid') {
        
       if(order.educational_cycle){

         const   user =  await this.UsersService.createFromOrder(order,order.educational_cycle)
         order.status = 'paid';
         order.educational_cycle.seatsAvailable -=1
         order.educational_cycle.seatsTaken +=1
         order.user =user
         order.price = Number(order.educational_cycle.price)
         await this.EducationalCycleService.save(order.educational_cycle)
         return this.acaOrderRepository.save(order);
       }
      } else {
        throw new NotFoundException('AcaOrder is already paid or not found.');
      }
    } catch (error) {
      throw new BadRequestException(error) 

      
    }
  }

}
