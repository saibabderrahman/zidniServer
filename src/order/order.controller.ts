import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';

import { OrderService } from './order.service';
import { JwtGuard } from '../users/Guard';
import { User } from '../typeorm/entities/User';
import { Request, Response } from 'express';



@Controller('order')
export class OrderController {

    constructor(private orderService:OrderService){}

    @UseGuards(JwtGuard)
    @Post("create")
    async CreateClass(@Res() res:Response , @Req() Dto:Request){
      const User:User = Dto.user as User; 
       Dto.body.user= User.id
      const data = await this.orderService.createOrder(Dto.body)
      if(data.order){
        res.status(201).json(data)
      }else{
        res.status(400).json(data)
      }
    }

    @Post("AddUSersToClass")
    async AddUsersToClass(@Res() res: Response, @Body() Dto: { ids: number[]; class: number }) {
      const data = await this.orderService.createOrders(Dto);
      if(data.success){
        res.status(201).json(data)
      }else{
        res.status(400).json(data)
      }
    }
    
    @Get("all") 
    async getAllOrders(){
      const data = await this.orderService.findAllOrder()
      return data
    }
    @Get("allCash") 
    async getAllOrdersCash(){
      const data = await this.orderService.findAllOrderPaidCashToday()
      return data
    }
    @Get("Class/:id") 
    async getAllOrdersByClass(@Param('id') id: number){
      const data = await this.orderService.findByIdClass(id)
      return data
    }
    @Put("paidCash/:id") 
    async CashOrder(@Res() res:Response ,@Param('id') id: number){
      const data = await this.orderService.PAidOrderCash(id)
      if(data.schoolPrice){
        res.status(200).json(data)
      }else{
        res.status(400).json(data)
      }
    }
    @Put("updateStatus/:id") 
    async updateStatus(@Res() res:Response ,@Param('id') id: number){
      const data = await this.orderService.endOrder(id)
      if(data.success){
        res.status(200).json(data)
      }else{
        res.status(400).json(data)
      }
    }
    @Get("getOneById/:id") 
    async getOneById(@Res() res:Response ,@Param('id') id: number){
      const data = await this.orderService.findOneByiD(id)
      if(data.success){
        res.status(200).json(data)
      }else{
        res.status(400).json(data)
      }
    }
    @Put("renewalOrder/:id") 
    async renewalOrder(@Res() res:Response ,@Param('id') id: number){
      const data = await this.orderService.renewalOrder(id)
      if(data.success){
        res.status(200).json(data)
      }else{
        res.status(400).json(data)
      }
    }



}
