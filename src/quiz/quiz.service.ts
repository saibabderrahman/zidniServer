import { Injectable } from '@nestjs/common';
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
    const quiz = this.quizRepository.create({
      title: createQuizDto.title,
      questions: createQuizDto.questions.map((question) => ({
        questionText: question.question,
        choices: question.choices,
        correctAnswer: question.answer,
      })),
      
    });
    return await this.quizRepository.save(quiz);
  }

  async findAll(): Promise<Quiz[]> {
    return this.quizRepository.find({ relations: ['questions'] });
  }

  async findOne(id: number): Promise<Quiz> {
    return this.quizRepository.findOne({ where: { id }, relations: ['questions'] });
  }

  async remove(id: number): Promise<void> {
    await this.quizRepository.delete(id);
  }
}
