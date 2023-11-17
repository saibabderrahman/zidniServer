import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AcaOrder } from 'src/typeorm/entities/acaOrders';
import { Repository } from 'typeorm';
import { AcaOrderDto } from './dto/AcaOrderDto ';
import {EducationalCycleService} from "../educational_cycle/educational_cycle.service"
import { UsersService } from 'src/users/users.service';
import { Options, queryAndPaginate } from 'src/utility/helpers.utils';


@Injectable()
export class AcaOrderService {
  constructor(
    @InjectRepository(AcaOrder)
    private readonly acaOrderRepository: Repository<AcaOrder>,
    private readonly EducationalCycleService:EducationalCycleService,
    private readonly UsersService:UsersService
  ) {}

  async createAcaOrder(orderDto: AcaOrderDto) {
    try {
      const educational_cycle = await this.EducationalCycleService.findOne(orderDto.educational_cycle)
      if(!educational_cycle){
        throw new BadRequestException('الدورة التدريبية التي تريد المشاركة فيها غير موجودة')
      }
      if(educational_cycle.seatsAvailable === 0){
        throw new BadRequestException('لا يوجد مقاعد متاحة في هذه الدوورة')
      }
      const existingOrder = await this.acaOrderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect("order.educational_cycle" ,"educational_cycle")
      .where('order.email = :email', { email: orderDto.email })
      .andWhere('order.phoneNumber = :phoneNumber', { phoneNumber: orderDto.phoneNumber })
      .andWhere('educational_cycle.id = :id', { id: orderDto.educational_cycle })
      .getOne();
      if (existingOrder) {
        throw new BadRequestException('هناك طلب مسبق بنفس البريد الإلكتروني ورقم الهاتف والدورة التدريبية.');
      }
      const NewOrder = {
        ...orderDto ,educational_cycle
      }
      return await this.acaOrderRepository.save(NewOrder);
    } catch (error) {
      throw new BadRequestException(error) 
    }
  }

  async findAllAcaOrders(options:Options) {
    try {

      const queryBuild = await this.acaOrderRepository.createQueryBuilder('AcaOrder')
      .leftJoinAndSelect('AcaOrder.educational_cycle', 'educational_cycle')
      .leftJoinAndSelect('AcaOrder.user', 'user')
  
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
      await this.acaOrderRepository.remove(existingOrder);
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
         order.user =user
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
