import { Module } from '@nestjs/common';
import { AcaOrderService } from './aca-order.service';
import { AcaOrderController } from './aca-order.controller';
import { AcaOrder } from 'src/typeorm/entities/acaOrders';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EducationalCycleModule } from 'src/educational_cycle/educational_cycle.module';
import { UsersModule } from 'src/users/users.module';
import { LoggerService } from 'src/logger.service';
import { RegistrationStateModule } from 'src/registration-state/registration-state.module';

@Module({
  imports:[TypeOrmModule.forFeature([AcaOrder]),EducationalCycleModule,UsersModule,RegistrationStateModule],
  providers: [AcaOrderService,LoggerService],
  controllers: [AcaOrderController],
  exports:[AcaOrderService]
})
export class AcaOrderModule {}
