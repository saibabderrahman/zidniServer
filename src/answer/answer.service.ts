import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { Answer, Quiz } from 'src/typeorm/entities';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
  ) {}

  async create(createAnswerDto: CreateAnswerDto): Promise<Answer> {
    const { studentName, score, answers, quizId } = createAnswerDto;

    try {
      // Fetch the quiz to make sure it exists
      const quiz = await this.quizRepository.findOne({ where: { id: quizId } });
      if (!quiz) {
        throw new NotFoundException('Quiz not found');
      }

      // Check if an answer from this student already exists for this quiz
      const existingAnswer = await this.answerRepository.findOne({
        where: {
          studentName,
          quiz: { id: quizId },
        },
      });

      if (existingAnswer) {
        throw new ConflictException('Student has already submitted an answer for this quiz');
      }

      const answer = this.answerRepository.create({
        studentName,
        score,
        answers,
        quiz,
      });

      return await this.answerRepository.save(answer);

    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new Error('An unexpected error occurred: ' + error.message);
    }
  }


  async findAll(): Promise<Answer[]> {
    return this.answerRepository.find({ relations: ['quiz'] });
  }

  async findOne(id: number): Promise<Answer> {
    return this.answerRepository.findOne({where: {id}, relations: ['quiz'] });
  }

  async remove(id: number): Promise<void> {
    const answer = await this.findOne(id);
    if (!answer) {
      throw new NotFoundException('Answer not found');
    }
    await this.answerRepository.remove(answer);
  }
}
