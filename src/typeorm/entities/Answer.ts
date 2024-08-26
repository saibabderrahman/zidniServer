import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Quiz } from './Quiz';

@Entity('answers')
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 255 })
  studentName: string;
  @Column({ type: 'double', default:0 })
  time: number;
  @Column({ type: 'int' })
  score: number;
  @Column({ type: 'json' })
  answers: any;
  @CreateDateColumn()
  submissionTime: Date;
  @ManyToOne(() => Quiz, (quiz) => quiz.answers, { onDelete: 'CASCADE' })
  quiz: Quiz;
}
