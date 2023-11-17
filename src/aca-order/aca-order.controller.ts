import { Controller, Get, Post, Put, Delete, Param, Body, UsePipes, ValidationPipe, Query, ParseIntPipe } from '@nestjs/common';
import { AcaOrderService } from './aca-order.service';
import { AcaOrderDto } from './dto/AcaOrderDto ';
import { AcaOrder } from 'src/typeorm/entities/acaOrders';

@Controller('aca-orders')
export class AcaOrderController {
  constructor(private readonly acaOrderService: AcaOrderService) {}

  @Post()
  @UsePipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }))
  async createAcaOrder(@Body() orderDto: AcaOrderDto) {
    return this.acaOrderService.createAcaOrder(orderDto);
  }

  @Get()
  async getAllAcaOrders(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
      ) {
    const options = { page, limit };

    return this.acaOrderService.findAllAcaOrders(options);
  }

  @Get(':id')
  async getAcaOrderById(@Param('id') id: number): Promise<AcaOrder> {
    return this.acaOrderService.acceptAcaOrder(id);
  }

  @Put(':id')
  async Accept(@Param('id') id: number): Promise<AcaOrder> {
    return this.acaOrderService.acceptAcaOrder(id);
  }

  @Delete(':id')
  async deleteAcaOrder(@Param('id') id: number): Promise<void> {
    return this.acaOrderService.deleteAcaOrder(id);
  }
}
