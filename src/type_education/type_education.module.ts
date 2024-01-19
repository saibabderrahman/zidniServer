import { Module } from '@nestjs/common';
import { TypeEducationController } from './type_education.controller';
import { TypeEducationService } from './type_education.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Type_Education } from 'src/typeorm/entities/typeOfEducation';
import { LevelsModule } from 'src/levels/levels.module';
import { EducationalCycleModule } from 'src/educational_cycle/educational_cycle.module';

@Module({
  imports:[TypeOrmModule.forFeature([Type_Education])],
  controllers: [TypeEducationController],
  providers: [TypeEducationService],
  exports:[TypeEducationService]
})
export class TypeEducationModule {}
