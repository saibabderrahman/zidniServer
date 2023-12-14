import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { Duties } from './duties';
import { User } from './User';
import { Note } from './Notes';

@Entity()
export class Solution {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  record: string;
  @Column({ type:"longtext"  })
  content: string;
  @ManyToOne(() => Duties, (classes )=> classes.solutions)
  duties:Duties;  
  @ManyToOne(() => User, (classes )=> classes.solutions)
  user:User;  
  @OneToOne(() => Note , cat=>cat.solution)
  @JoinColumn({name:"notesId"})
  notes: Note;
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}