import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Classes } from './Classes';
import { Order } from './Order';
import { Attendance } from './Attendance';
import { Subject } from './subject';

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
  @OneToMany(()=>Attendance,att=>att.Lesson)
  Attendance:Attendance[]
  @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

}