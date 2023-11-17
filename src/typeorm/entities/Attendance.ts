import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { User } from './User';
import { Lesson } from './Lesson';
import { AcaOrder } from './acaOrders';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ default: 'absent' })
  state: string;
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @ManyToOne(() => User, classes => classes.Attendance)
  user: User;
  @ManyToOne(() => AcaOrder, classes => classes.Attendance)
  order: AcaOrder;
  @ManyToOne(()=>Lesson,  order => order.Attendance)
  Lesson:Lesson
}