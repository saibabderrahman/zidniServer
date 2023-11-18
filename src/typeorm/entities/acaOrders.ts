import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Educational_cycle } from './Educational_cycle';
import { User } from './User';
import { Attendance } from './Attendance';


@Entity()
export class AcaOrder {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  firstName:string
  @Column()
  lastName:string
  @Column()
  email:string
  @OneToMany(()=>Attendance , att => att.order)
  Attendance:Attendance[]
  @Column()
  image:string
  @Column()
  price:number
  @Column()
  phoneNumber:string
  @Column({nullable:true})
  cart:string
  @Column({default:"in person"})
  type:string
  @Column({ default: 'notPaid' })
  status: string;
  @Column({ default: false })
  active: boolean;
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
