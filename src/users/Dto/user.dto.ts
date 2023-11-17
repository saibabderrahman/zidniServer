import { IsString, IsInt , IsEmail ,IsNotEmpty, isString, IsOptional} from 'class-validator';
export class userDto{
        @IsString()
        @IsNotEmpty()
        firstName:string
        @IsString()
        @IsNotEmpty()
        lastName:string
        @IsString()
        @IsNotEmpty()
        @IsEmail()
        email:string
        @IsString()
        @IsNotEmpty()
        password:string
        @IsNotEmpty()
        phoneNumber:number
        @IsString()
        avatar:string
        @IsString()
        address:string
        @IsNotEmpty()
        zipCode: number
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
        @IsOptional()
        memorizationValue: string; 
        @IsString()
        @IsOptional()
        fatherName: string; 
        @IsString()
        @IsOptional()
        school: string; 
    } 