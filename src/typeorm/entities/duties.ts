import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Lesson } from './Lesson';
import { Solution } from './solution';

@Entity()
export class Duties {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({ type:"text"  })
  description: string;
  @OneToOne(() => Lesson ,(lesson)=>lesson.duty)
  @JoinColumn({name:"lesson_id"})
  lesson: Lesson;
  @OneToMany(() => Solution, cat => cat.duties)
  solutions: Solution;
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  
}