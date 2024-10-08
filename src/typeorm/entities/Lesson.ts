import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, OneToOne } from 'typeorm';
import { Classes } from './Classes';
import { Attendance } from './Attendance';
import { Subject } from './subject';
import { Duties } from './duties';

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @Column({ default: 'start' })
  state: string;
  @Column({nullable:true})
  name: string;
  @Column({nullable:true ,default:"telegram"})
  platform: string;
  @Column({ type:"text" ,nullable:true })
  url: string;
  @ManyToOne(() => Classes, classes => classes.Category)
  Classes: Classes;
  @ManyToOne(() => Subject, (classes )=> classes.lessons)
  subject:Subject;
  @OneToOne(() => Duties , cat=>cat.lesson)
  duty: Duties;
  @OneToMany(()=>Attendance,att=>att.Lesson)
  Attendance:Attendance[]
  @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

}