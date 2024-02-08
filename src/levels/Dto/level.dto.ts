import { IsString,IsNotEmpty, IsNumber, IsOptional} from 'class-validator';

export class LevelDto{
    @IsString()
    @IsNotEmpty()
    name:string
    @IsNumber()
    type:number
    @IsOptional()
    state:boolean
} 