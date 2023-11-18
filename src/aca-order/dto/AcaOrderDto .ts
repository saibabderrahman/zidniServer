import { IsString, IsEmail, IsEnum, IsOptional, IsDate, IsPhoneNumber, IsNumber, IsNotEmpty } from 'class-validator';

export class AcaOrderDto {
  @IsOptional()
  id: number;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber(null, { message: 'Invalid phone number' })
  @IsString()
  phoneNumber: string;

  @IsNumber()
  educational_cycle: number;

  @IsString()
  cart:string
  @IsString()
  @IsOptional()

  level:string



  @IsString()
  @IsOptional()

  type: string;

  @IsString()
  @IsOptional()
  status: string;
  @IsString()
  @IsOptional()
  gender: string; 
  @IsString()
  @IsOptional()
  dateOfBirth: string; 
  @IsString()
  @IsOptional()
  educationLevel: string; 
  @IsString()
  image:string
  @IsString()
  @IsOptional()
  memorizationValue: string; 
  @IsString()
  @IsOptional()
  fatherName: string; 
  @IsString()
  @IsOptional()
  school: string; 
}
