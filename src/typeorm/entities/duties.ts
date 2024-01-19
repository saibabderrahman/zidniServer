import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Lesson } from './Lesson';
import { Solution } from './solution';
import { Levels } from './Levels';

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
  solutions: Solution[];
  @ManyToOne(() => Levels, cat => cat.duties)
  level: Levels;
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  
}