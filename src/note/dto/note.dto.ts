import { IsString,IsNotEmpty, IsNumber, IsOptional} from 'class-validator';

export class NoteDto{
    @IsString()
    @IsNotEmpty()
    note:string
    @IsString()
    @IsOptional()
    record:string
    @IsNumber()
    @IsNotEmpty()
    solution:number
} 