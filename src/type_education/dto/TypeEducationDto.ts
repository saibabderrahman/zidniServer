import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TypeEducationDto {

  @IsOptional()
  
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

}
