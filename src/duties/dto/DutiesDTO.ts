import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class DutiesDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  lesson: number;

}
