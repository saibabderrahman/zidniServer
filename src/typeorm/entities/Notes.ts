import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, ManyToOne } from 'typeorm';
import { Solution } from './solution';

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type:"longtext"  })
  note: string;

  @OneToOne(() => Solution , cat=>cat.notes)
  solution: Solution;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}