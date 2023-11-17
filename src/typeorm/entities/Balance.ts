import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Teacher } from './Teacher';
import { Order } from './Order';

@Entity()
export class Balance {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Teacher, user => user.balance)
  teacher: Teacher;
  @OneToMany(()=>Order , att => att.balance)
  orders:Order
  @Column({ default: 'cash' })
  type: string;
  @Column()
  priceTotal: number;
  @Column({ default: 'notWithdrawable' })
  status: string;
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  paidAt: Date;
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
