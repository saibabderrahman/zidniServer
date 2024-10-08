import { Module } from '@nestjs/common';
import { EducationalCycleController } from './educational_cycle.controller';
import { EducationalCycleService } from './educational_cycle.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Educational_cycle } from 'src/typeorm/entities/Educational_cycle';
import { TypeEducationModule } from 'src/type_education/type_education.module';
import { LoggerService } from 'src/logger.service';

@Module({
  imports:[TypeOrmModule.forFeature([Educational_cycle]),TypeEducationModule],
  controllers: [EducationalCycleController],
  providers: [EducationalCycleService ,LoggerService],
  exports:[EducationalCycleService]
})
export class EducationalCycleModule {}
