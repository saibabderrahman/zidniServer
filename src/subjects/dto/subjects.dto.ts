import { IsString, IsBoolean, IsArray, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';
import { EducationalCycleDTO } from 'src/educational_cycle/dto/EducationalCycleDTO';
import { TeacherDto } from 'src/teacher/Dto';
import { Educational_cycle } from 'src/typeorm/entities/Educational_cycle';


export class CategoryDto{
    @IsString()
    @IsNotEmpty()
    name:string
    @IsNumber()
    id:number
} 

export class LevelDto{
    @IsString()
    @IsNotEmpty()
    name:string
    @IsNumber()
    id:number
} 
export class CreateSubjectDTO {
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsBoolean()
  @IsOptional()
  type: boolean;
  @IsBoolean()
  @IsOptional()

  show: boolean;
  @IsNotEmpty()
  Category: CategoryDto; // Update with the appropriate type
  @IsNotEmpty()
  Level: LevelDto; // 
  @IsString()
  time: string;
  @IsArray()
  day: string[];
  @IsString()
  end: string;
  @IsString()
  start: string;
  @IsNumber()
  @IsOptional()
  ratings?: number;
  @IsNotEmpty()
  cycle:Educational_cycle
  @IsOptional()
  teacher: TeacherDto;
  @IsNumber()
  @IsOptional()
  coures?: number;
}
