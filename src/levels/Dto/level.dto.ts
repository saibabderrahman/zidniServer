import { IsString,IsNotEmpty} from 'class-validator';

export class LevelDto{
    @IsString()
    @IsNotEmpty()
    name:string
} 