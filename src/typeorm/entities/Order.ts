import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Classes } from './Classes';
import { User } from './User';
import { Teacher } from './Teacher';
import { Lesson } from './Lesson';
import { Attendance } from './Attendance';
import { Balance } from './Balance';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Classes, product => product.orders)
  Class: Classes;
  /*@ManyToOne(() => Lesson, product => product.orders)
  Lessons: Lesson;*/
  @ManyToOne(() => User, user => user.orders)
  user: User;
  @ManyToOne(() => Teacher, user => user.orders)
  teacher: Teacher;
  @ManyToOne(() => Balance, user => user.orders)
  balance: Balance;
  @OneToMany(()=>Attendance , att => att.order)
  Attendance:Attendance[]
  @Column({ default: 'cash' })
  type: string;
  @Column()
  priceTotal: number;
  @Column()
  TeacherPrice: number;
  @Column()
  schoolPrice: number;
  @Column()
  expiring: number;
  @Column({ default: 0 })
  numberC: number;
  @Column({ default: 'notPaid' })
  status: string;
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  paidAt: Date;
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
