import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty, IsNumber } from 'class-validator';


export class RecordingDto {
  @IsString()
  @IsNotEmpty()
  file: string;
  @IsString()
  @IsNotEmpty()
  duration: string;
}
export class CreateSolutionDto {
  @IsString()
  @IsNotEmpty()
  content: string;
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsArray()
  @ArrayNotEmpty()
  record: RecordingDto;
}

