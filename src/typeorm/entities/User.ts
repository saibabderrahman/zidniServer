import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Exclude, classToPlain } from 'class-transformer';
import { Order } from './Order';
import { Classes } from './Classes';
import { Attendance } from './Attendance';
import { Educational_cycle } from './Educational_cycle';
import { AcaOrder } from './acaOrders';
import { Solution } from './solution';
const  argon2  = require('argon2');



@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;
  @Column({ type: 'bigint',nullable: true })
  phoneNumber: number;
  @Column({ nullable: true })
  zipCode: number;
  @OneToMany(() => Solution, cat => cat.user)
  solutions: Solution;
  @Column()
  address: string;
  @OneToMany(() => Order, order => order.user)
  orders: Order[];
  @OneToMany(() => AcaOrder, order => order.user)
  aca_orders: AcaOrder[];
  @ManyToMany(()=>Classes)
  @JoinTable()
  Classes:Classes[]
  @ManyToMany(()=>Educational_cycle)
  @JoinTable()
  education_cycle:Educational_cycle[]
  @Column({ nullable: true })
  gender: string;
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
  @Column({ default: 'user' })
  role: string;
  @Column({nullable:true})
  avatar: string;
  @Column({ nullable: true })
  socketId: string;
  @Column({ default: 'Offline' })
  status: string;
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @Column({ nullable: true })
  resetPasswordToken: string;
  @Column({ nullable: true })
  resetPasswordTime: Date;
  @OneToMany(()=>Attendance , att => att.user)
  Attendance:Attendance[]
  @Column({ default: false })
  active: boolean;
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && this.password.length > 4) {
      this.password = await argon2.hash(this.password);
    }
  }

  async comparePassword(plainPassword: string): Promise<boolean> {
    return await argon2.verify(this.password, plainPassword);
  }

  toJSON() {
    return classToPlain(this); // Convert the entity to a plain object
  }


}
