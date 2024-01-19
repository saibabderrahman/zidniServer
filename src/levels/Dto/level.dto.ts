import { IsString,IsNotEmpty, IsNumber} from 'class-validator';

export class LevelDto{
    @IsString()
    @IsNotEmpty()
    name:string
    @IsNumber()
    type:number
} 