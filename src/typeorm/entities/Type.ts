import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Classes } from './Classes';
import { Attendance } from './Attendance';
import { Educational_cycle } from './Educational_cycle';
import { Levels } from './Levels';

@Entity()
export class Type {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  description: string;
  @Column({ default: 'start' })
  state: string;

  @Column({ default: 0 })
  seatsAvailable: number;
  @Column({ default: 0 })
  seatsTotal: number;
  @OneToMany(() => Levels, cat => cat.type)
  Levels: Levels;
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

}