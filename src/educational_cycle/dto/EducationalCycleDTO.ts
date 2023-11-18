import { IsString, IsBoolean, IsOptional, IsInt, ArrayMinSize, ArrayMaxSize, Min, Max, ArrayNotEmpty, IsArray, IsNumber, IsNotEmpty } from 'class-validator';


export class TypeDTO {
  @IsString()
  name: string;
  

  @IsString()
  description: string;

  @IsString()
  state: string;

  @IsInt()
  @Min(0)
  seatsAvailable: number;

  @IsInt()
  @Min(0)
  seatsTotal: number;


}
export class EducationalCycleDTO {
  @IsString()
  name: string;
  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  description: string;
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images: string[];
  @IsString()
  subDescription: string;

  @IsString()
  type: string;

  @IsBoolean()
  show: boolean;

  @IsString()
  time: string;

  @IsOptional()
  @IsString()
  tags: string;

  @IsOptional()
  @IsInt()
  ratings: number;
  
  @IsNumber()
  @IsNotEmpty()
  price: number;
  @IsInt()
  @IsOptional()  
  comparAtPrice: number;
  @IsInt()
  @IsOptional()  
  seatsAvailable: number;
  @IsInt()
 
  seatsTotal: number;
  @IsInt()
  @IsOptional()
  @Min(0)
  seatsTaken: number;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(0)
  studentIds: number[];


}
