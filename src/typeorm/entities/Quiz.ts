import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Question } from './question.entity';
import { Answer } from './Answer';

@Entity('quiz')
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @OneToMany(() => Question, (question) => question.quiz, { cascade: true })
  questions: Question[];
  @OneToMany(() => Answer, (answer) => answer.quiz)
  answers: Answer[];

}
