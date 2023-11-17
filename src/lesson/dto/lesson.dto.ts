import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Classes } from '../../typeorm/entities/Classes';
import { Order } from '../../typeorm/entities/Order';
import { Attendance } from '../../typeorm/entities/Attendance';

export class orderDto {

  @IsNotEmpty()
  Classes: Classes[];
  @IsNotEmpty()
  orders:Order[]
  @IsNotEmpty()
  Attendance:Attendance[]

}

export class LessonDto {

  @IsNumber()
  @IsNotEmpty()
  id:number
  @IsString()
  @IsOptional()
  name:string
  @IsString()
  @IsOptional()
  platform:string
  @IsString()
  @IsOptional()
  url:string



}