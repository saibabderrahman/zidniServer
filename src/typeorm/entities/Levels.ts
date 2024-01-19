import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Classes } from './Classes';
import { Type } from './Type';
import { Type_Education } from './typeOfEducation';
import { Duties } from './duties';

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
  @ManyToOne(() => Type_Education, classes => classes.levels)
  type: Type;
  @OneToMany(() => Classes, classes => classes.Category)
  catClasses: Classes[];
  @OneToMany(() => Duties, classes => classes.level)
  duties: Duties[];

  @OneToMany(() => Classes, classes => classes.Level)
  LevelClasses:Classes[]
}