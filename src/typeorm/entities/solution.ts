import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, ManyToOne } from 'typeorm';
import { Duties } from './duties';
import { User } from './User';

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
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}