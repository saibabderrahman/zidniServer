import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateQuizDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: 'At least one question is required' })
  @IsArray()
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty({ message: 'Question text is required' })
  question: string;
  @IsOptional()
  @IsNumber()
  id?: number;
  @IsArray()
  @ArrayMinSize(2, { message: 'At least two choices are required' })
  @IsNotEmpty({ each: true, message: 'Choices cannot be empty' })
  choices: string[];
  @IsString()
  @IsNotEmpty({ message: 'Correct answer is required' })
  answer: string;
  @IsNumber()
  @IsOptional()
  points: number;
}
