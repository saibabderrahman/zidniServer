import { Controller, Get, Post, Put, Delete, Param, Body, UsePipes, ValidationPipe, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AcaOrderService } from './aca-order.service';
import { AcaOrderDto } from './dto/AcaOrderDto ';
import { AcaOrder } from 'src/typeorm/entities/acaOrders';
import { JwtGuard } from 'src/admin/Guard';

@Controller('aca-orders')
export class AcaOrderController {
  constructor(private readonly acaOrderService: AcaOrderService) {}

  @Post()
  @UsePipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }))
  async createAcaOrder(@Body() orderDto: AcaOrderDto) {
    return await this.acaOrderService.createAcaOrder(orderDto);
  }

  @Get()
  @UseGuards(new JwtGuard)
  async getAllAcaOrders(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
      ) {
    const options = { page, limit };
    return this.acaOrderService.findAllAcaOrders(options);
  }
  @Get("some")
  async calculateTotalPaidToday() {
    return this.acaOrderService.calculateTotalPaidToday();
  }
  @Get('calculate-total-paid')
  async calculateTotalPaidBetweenDates(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ) {
    return this.acaOrderService.calculateTotalPaidBetweenDates(new Date(startDate), new Date(endDate));
  }
  @Get(':id')
  async getAcaOrderById(@Param('id') id: number): Promise<AcaOrder> {
    return this.acaOrderService.acceptAcaOrder(id);
  }

  @Put(':id')
  async Accept(@Param('id') id: number): Promise<void> {
    return this.acaOrderService.acceptAcaOrderFromTelegram(id);
  }
  @Put('refuse/:id')
  async Refuse(@Param('id') id: number): Promise<void> {
    return this.acaOrderService.RefuseAcaOrderFromTelegram(id);
  }


  @Delete(':id')
  async deleteAcaOrder(@Param('id') id: number): Promise<void> {
    return this.acaOrderService.deleteAcaOrder(id);
  }
}
