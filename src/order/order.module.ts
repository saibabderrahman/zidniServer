import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { JwtStrategy } from '../users/strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../typeorm/entities/Order';
import { User } from '../typeorm/entities/User';
import { Classes } from '../typeorm/entities/Classes';
import { Teacher } from '../typeorm/entities/Teacher';
import { Balance} from '../typeorm/entities/Balance';
import { TRANSCODE_QUEUE } from '../constants';
import { BullModule } from '@nestjs/bull';



@Module({
  imports:[TypeOrmModule.forFeature([Order,User,Classes,Teacher,Balance]) , BullModule.registerQueue({
    name:TRANSCODE_QUEUE,
  }),],

  controllers: [OrderController],
  providers: [OrderService , JwtStrategy]
})
export class OrderModule {}
