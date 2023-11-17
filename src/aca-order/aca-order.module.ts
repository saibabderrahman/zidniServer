import { Module } from '@nestjs/common';
import { AcaOrderService } from './aca-order.service';
import { AcaOrderController } from './aca-order.controller';
import { AcaOrder } from 'src/typeorm/entities/acaOrders';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EducationalCycleModule } from 'src/educational_cycle/educational_cycle.module';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports:[TypeOrmModule.forFeature([AcaOrder]),EducationalCycleModule,UsersModule],
  providers: [AcaOrderService],
  controllers: [AcaOrderController]
})
export class AcaOrderModule {}
