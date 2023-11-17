import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn,  ManyToMany,BeforeInsert, JoinTable } from 'typeorm';
import { Teacher } from './Teacher';
import { Category } from './Category';
import { Levels } from './Levels';
import { Order } from './Order';
import { User } from './User';
import { Lesson } from './Lesson';

@Entity()
export class Classes {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  description: string;
  @Column({ default: false })
  type: boolean;
  @Column({ default: false })
  show: boolean;
  @Column()
  time: string;
  @Column('simple-array', { nullable: true })
  day:string[] = [];
  @Column()
  end: string;
  @Column()
  start: string;
  @Column({ nullable: true })
  tags: string;
  @Column({ nullable: true })
  priceTotal: number;
  @Column({ nullable: true })
  TeacherPrice: number;
  @Column({ nullable: true })
  schoolPrice: number;
  @Column({ nullable: true ,default: 5 })
  ratings: number;
  @Column({ default: 0 })
  seatsAvailable: number;
  @Column({ default: 0 })
  seatsTotal: number;
  @Column({ default: 0 })
  seatsTaken: number;
  @ManyToOne(() => Teacher, teacher => teacher.classes)
  teacher: Teacher;
  @OneToMany(()=>Order ,  order => order.Class)
  orders:Order[]
  @ManyToOne(() => Category, cat => cat.catClasses)
  Category: Category;
  @OneToMany(() => Lesson, cat => cat.Classes)
  Lessons: Lesson;
  @ManyToOne(() => Levels, cat => cat.LevelClasses)
  Level: Levels;
  @ManyToMany(()=>User)
  @JoinTable()
  student:User[]
  @Column({ default: 0 })
  benefit: number; 
  @Column({ default: 4 })
  coures: number;
  @Column('simple-array', { nullable: true })
  studentIds: number[] = [];
  @Column('simple-array', { nullable: true })
  WaitingConfirmation: number[] = [];
  @BeforeInsert()
  async addAvailableSeates() {
      this.seatsAvailable = this.seatsTotal;
  }

}
