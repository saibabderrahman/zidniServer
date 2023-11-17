import { Module } from '@nestjs/common';
import { ClasseController } from './classe.controller';
import { ClasseService } from './classe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Classes } from '../typeorm/entities/Classes';
import { JwtStrategy } from "../teacher/strategy";
import { Teacher } from '../typeorm/entities/Teacher';


@Module({
  imports:[TypeOrmModule.forFeature([Classes,Teacher]) ],
  controllers: [ClasseController],
  providers: [ClasseService , JwtStrategy]
})
export class ClasseModule {}
