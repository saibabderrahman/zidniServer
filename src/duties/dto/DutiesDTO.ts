import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class DutiesDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNumber()
  @IsOptional()
  lesson: number;
  @IsNumber()
  @IsOptional()
  level: number;

  

}
