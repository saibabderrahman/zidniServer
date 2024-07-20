import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Educational_cycle } from './Educational_cycle';
import { User } from './User';
import { Attendance } from './Attendance';


@Entity()
export class AcaOrder {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({nullable:true})
  firstName:string
  @Column({nullable:true})
  lastName:string
  @Column({nullable:true})
  email:string
  @Column({nullable:true})
  age:string
  @OneToMany(()=>Attendance , att => att.order)
  Attendance:Attendance[]
  @Column({nullable:true})
  image:string
  @Column({nullable:true})
  price:number
  @Column({nullable:true})
  phoneNumber:string
  @Column({nullable:true})
  cart:string
  @Column({nullable:true})
  type:string
  @Column({ type: 'bigint', nullable: true })
  chatId: string;
  @Column({ default: 'notPaid' })
  status: string;
  @Column({ default: false })
  active: boolean;
  @Column({ default: false })
  addonCourse: boolean;
  @ManyToOne((type) => Educational_cycle)
  educational_cycle: Educational_cycle;
  @ManyToOne(() => User, user => user.orders)
  user: User;
  @Column({ nullable: true })
  gender: string;
  @Column({ nullable: true })
  level: string;
  @Column({ nullable: true })
  dateOfBirth: string; 
  @Column({ nullable: true })
  educationLevel: string;
  @Column({ nullable: true })
  school: string;
  @Column({ nullable: true })
  wilaya: string;
  @Column({ nullable: true })
  commune: string;
  @Column({ nullable: true })
  memorizationValue: string; 
  @Column({ nullable: true })
  fatherName: string; 
  @Column({nullable:true})
  avatar: string;
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  paidAt: Date;
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
