import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn,  ManyToMany,BeforeInsert, JoinTable } from 'typeorm';
import { Teacher } from './Teacher';
import { Category } from './Category';
import { Levels } from './Levels';
import { Lesson } from './Lesson';
import { Educational_cycle } from './Educational_cycle';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  description: string;
  @Column({ default: false })
  type: boolean;
  @Column({ default: false })
  show: boolean;
  @Column()
  time: string;
  @Column('simple-array', { nullable: true })
  day:string[] = [];
  @Column()
  end: string;
  @Column()
  start: string;
  @Column({ nullable: true ,default: 5 })
  ratings: number;
  @ManyToOne(() => Teacher, teacher => teacher.classes)
  teacher: Teacher;
  @OneToMany(() => Lesson, cat => cat.subject)
  lessons: Lesson;
  @ManyToOne(() => Levels, cat => cat.LevelClasses)
  Level: Levels;
  @ManyToOne(() => Category, cat => cat.subjects)
  Category: Category;
  @ManyToOne(() => Educational_cycle, cat => cat.subjects)
  cycle: Educational_cycle;
  @Column({ default:0 })
  coures: number;
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  startAt: Date;
}
