import { IsString, IsInt , IsEmail ,IsNotEmpty, isString ,IsOptional, IsNumber} from 'class-validator';



export class TeacherDto{
    @IsString()
    @IsNotEmpty()
    firstName:string
    @IsNumber()
    @IsOptional()
    id:number
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
    @IsOptional() // Marking the variable as optional
    banckName: number

    @IsOptional() // Marking the variable as optional
    salary: number

} 