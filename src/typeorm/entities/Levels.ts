import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Classes } from './Classes';
import { Type } from './Type';

@Entity()
export class Levels {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({ unique: true })
  slug: string;
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @ManyToOne(() => Type, classes => classes.Levels)
  type : Type;
  @OneToMany(() => Classes, classes => classes.Category)
  catClasses: Classes[];
  @OneToMany(() => Classes, classes => classes.Level)
  LevelClasses:Classes[]
}