import { IsString,IsNotEmpty, IsNumber} from 'class-validator';

export class NoteDto{
    @IsString()
    @IsNotEmpty()
    note:string
    @IsNumber()
    @IsNotEmpty()
    solution:number
} 