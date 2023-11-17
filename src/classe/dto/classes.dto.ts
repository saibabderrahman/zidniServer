import { IsNumber, IsString, IsBoolean, IsOptional, ValidateNested, IsNotEmpty, IsArray } from 'class-validator';
import { Category } from '../../typeorm/entities/Category';
import { Levels } from '../../typeorm/entities/Levels';
import { Teacher } from '../../typeorm/entities/Teacher';

export class ClassesDto {
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsArray()
  time: string; // Assuming the time is an array of strings
  @IsString()
  day: string[];
  @IsString()
  start: string;
  @IsString()
  end: string;
  @IsOptional()
  @IsString()
  tags: string;
  @IsNumber()
  priceTotal: number;
  @IsNumber()
  TeacherPrice: number;
  @IsNumber()
  schoolPrice: number;
  @IsOptional()
  @IsNumber()
  ratings: number;
  @IsNotEmpty()
  Category: Category; // Update with the appropriate type
  @IsNotEmpty()
  Level: Levels; // Update with the appropriate type
  @IsNotEmpty()
  @IsNumber()
  seatsTotal:number
  @IsOptional()
  teacher: Teacher;
  @IsOptional()
  benefit: number;
  @IsNumber()
  coures:number

}