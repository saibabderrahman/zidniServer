import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Educational_cycle } from './Educational_cycle';
import { Levels } from './Levels';

@Entity()
export class Type_Education {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  description: string;
  @OneToMany(() => Educational_cycle, (classes )=> classes.type_Education)
  Educational_cycles:Educational_cycle;
  @OneToMany(() => Levels, (classes )=> classes.type)
  levels:Levels;
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;





}