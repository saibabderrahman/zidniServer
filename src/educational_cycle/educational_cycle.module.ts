import { Module } from '@nestjs/common';
import { EducationalCycleController } from './educational_cycle.controller';
import { EducationalCycleService } from './educational_cycle.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Educational_cycle } from 'src/typeorm/entities/Educational_cycle';

@Module({
  imports:[TypeOrmModule.forFeature([Educational_cycle])],
  controllers: [EducationalCycleController],
  providers: [EducationalCycleService],
  exports:[EducationalCycleService]
})
export class EducationalCycleModule {}
