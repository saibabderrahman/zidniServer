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
  @IsOptional()
  @IsString()
  description: string;
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images: string[];
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  levels: string[];
  @IsString()
  @IsOptional()
  subDescription: string;
  @IsString()
  @IsOptional()
  type: string;
  @IsNumber()
  type_Education:number
  @IsOptional()
  @IsBoolean()
  show: boolean;
  @IsOptional()
  @IsString()
  time: string;

  @IsOptional()
  @IsInt()
  ratings: number;
  @IsNumber()
  @IsNotEmpty()
  price: number;
  @IsInt()
  @IsOptional()  
  seatsAvailable: number;
  @IsInt()
  @IsOptional()
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
