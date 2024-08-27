import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { Quiz } from 'src/typeorm/entities';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
  ) {}

  async createQuiz(createQuizDto: CreateQuizDto): Promise<Quiz> {
    try {
      const quiz = this.quizRepository.create({
        title: createQuizDto.title,
        questions: createQuizDto.questions.map((question) => ({
          questionText: question.question,
          choices: question.choices,
          correctAnswer: question.answer,
        })),
      });
      return await this.quizRepository.save(quiz);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create the quiz');
    }
  }

  async findAll(): Promise<Quiz[]> {
    try {
      return await this.quizRepository.find({ relations: ['questions'] });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch quizzes');
    }
  }

  async findOne(id: number): Promise<Quiz> {
    try {
      const quiz = await this.quizRepository.findOne({
        where: { id },
        relations: ['questions'],
      });
      if (!quiz) {
        throw new NotFoundException('Quiz not found');
      }
      return quiz;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch the quiz');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.quizRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('Quiz not found');
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete the quiz');
    }
  }
  async updateQuiz(id: number, createQuizDto: CreateQuizDto) {
    try {
      const quiz = await this.quizRepository.findOne({ where: { id }, relations: ['questions'] });
      
      if (!quiz) {
        throw new NotFoundException('Quiz not found');
      }
      quiz.title = createQuizDto.title || quiz.title
  
      const questions = createQuizDto.questions.map((questionDto) => {
        const existingQuestion = quiz.questions.find(q => q.id === questionDto.id);
  
        return {
          id: existingQuestion?.id ?? undefined, 
          questionText: questionDto.question,     
          choices: questionDto.choices,          
          correctAnswer: questionDto.answer,      
          points: existingQuestion?.points ?? 1,  
        };
      });  
      return await this.quizRepository.save({...quiz,questions });
    } catch (error) {
      throw new InternalServerErrorException('Failed to update the quiz');
    }
  }
  
}
