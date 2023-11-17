import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BeforeInsert, BeforeUpdate} from 'typeorm';
import { Exclude, classToPlain } from 'class-transformer';

const  argon2  = require('argon2');

import {Classes} from "./Classes"
import { Order } from './Order';
import { Balance } from './Balance';
import { Subject } from './subject';



@Entity() 
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column({ unique: true })
  email: string;
  @Exclude() // Exclude the password property from serialization
  @Column()
  password: string;
  @Column({ type: 'bigint', unique: true, nullable: true })
  phoneNumber: number;
  @Column({ nullable: true })
  zipCode: number;
  @Column()
  address: string;
  @Column({ default: 'Teacher' })
  role: string;
  @Column({ nullable: true })
  avatar: string;
  @Column({ nullable: true })
  description: string;
  @Column({ default: false })
  active: boolean;
  @Column({ default: false })
  accepted: boolean;
  withdrawMethodBankName: string;
  @Column({ type: 'bigint', nullable: true })
  withdrawMethodBankAccountNumber: number;
  @Column({ nullable: true })
  withdrawMethodBankHolderName: string;
  @Column({ default: 0 })
  availableBalance: number;
  @Column({ default: 0 })
  salary: number;
  @Column({ nullable: true })
  socketId: string;
  @Column({ nullable: true })
  resetPasswordToken: string;
  @Column({ nullable: true })
  resetPasswordTime: Date;
  @OneToMany(() => Subject, classes => classes.teacher)
  classes: Subject[];
  @OneToMany(() => Balance, classes => classes.teacher)
  balance: Balance[];
  @OneToMany(() => Order, order => order.teacher)
  orders: Order[];
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
