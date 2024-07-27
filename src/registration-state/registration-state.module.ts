import { Module } from '@nestjs/common';
import { RegistrationStateController } from './registration-state.controller';
import { RegistrationStateService } from './registration-state.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessengerRegistrationState, RegistrationState } from 'src/typeorm/entities';

@Module({
  imports:[TypeOrmModule.forFeature([RegistrationState,MessengerRegistrationState])],
  controllers: [RegistrationStateController],
  providers: [RegistrationStateService],
  exports:[RegistrationStateService]
})
export class RegistrationStateModule {}
