import { IsString, IsInt , IsEmail ,IsNotEmpty, isString ,IsOptional} from 'class-validator';



export class AdminDto{
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
} 