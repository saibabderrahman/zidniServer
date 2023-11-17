import { IsNumber, IsString, IsBoolean, IsOptional, ValidateNested, IsNotEmpty } from 'class-validator';
import { Classes } from '../../typeorm/entities/Classes';
import { Teacher } from '../../typeorm/entities/Teacher';
import { User } from '../../typeorm/entities/User';

export class orderDto {
  @IsNumber()
  @IsNotEmpty()
  priceTotal: number;
  @IsNumber()
  @IsNotEmpty()
  TeacherPrice: number;
  @IsNumber()
  @IsNotEmpty()
  schoolPrice: number;
  @IsNumber()
  @IsNotEmpty()
  teacher: Teacher;
  @IsNumber()
  @IsNotEmpty()
  user: User;
  @IsNotEmpty()
  class: Classes;
  @IsNumber()
  expiring:number
}