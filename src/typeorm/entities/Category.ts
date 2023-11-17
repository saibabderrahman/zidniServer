import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Classes } from './Classes';
import { Subject } from './subject';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @OneToMany(() => Classes, classes => classes.Category)
  catClasses: Classes[];
  @OneToMany(() => Subject, classes => classes.Category)
  subjects: Subject[];
}