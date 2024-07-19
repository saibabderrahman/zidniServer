import { Module } from '@nestjs/common';
import { RegistrationStateController } from './registration-state.controller';
import { RegistrationStateService } from './registration-state.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrationState } from 'src/typeorm/entities';

@Module({
  imports:[TypeOrmModule.forFeature([RegistrationState])],
  controllers: [RegistrationStateController],
  providers: [RegistrationStateService],
  exports:[RegistrationStateService]
})
export class RegistrationStateModule {}
