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
  @IsOptional()
  telegrams_links: string;


  
  @IsString()
  @IsOptional()
  price_payment_terms: string;
  @IsString()
  @IsOptional()
  whatsapp_number: string;
  @IsString()
  @IsOptional()
  contact_phone: string;
  @IsString()
  @IsOptional()
  admin_telegrams_links: string;
  @IsString()
  @IsOptional()
  token_bot_telegram: string;
  @IsString()
  @IsOptional()
  ccp: string;
  @IsString()
  @IsOptional()
  timeDetails: string;
  @IsString()
  @IsOptional()
  howToLean: string;
  @IsString()
  @IsOptional()
  special: string;
  @IsString()
  @IsOptional()
  addonCourse: string;

  @IsString()
  @IsOptional()
  about_video: string;
  @IsString()
  @IsOptional()
  about_audio: string;
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
  reviews: string[];
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
