import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Quiz } from './Quiz';


@Entity('question')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  questionText: string;

  @Column('simple-array')
  choices: string[];

  @Column({ type: 'varchar', length: 255 })
  correctAnswer: string;

  @Column({ type: 'int', default: 1 }) 
  points: number;


  @ManyToOne(() => Quiz, (quiz) => quiz.questions, { onDelete: 'CASCADE' })
  quiz: Quiz;
}
