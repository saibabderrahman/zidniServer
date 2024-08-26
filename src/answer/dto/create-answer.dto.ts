import { IsNotEmpty, IsString, IsArray, IsInt, IsOptional } from 'class-validator';

export class CreateAnswerDto {
  @IsNotEmpty()
  @IsString()
  studentName: string;
  @IsNotEmpty()
  @IsInt()
  score: number;
  @IsNotEmpty()
  @IsArray()
  answers: any[];
  @IsOptional()
  time: number;
  @IsNotEmpty()
  @IsInt()
  quizId: number;
}
