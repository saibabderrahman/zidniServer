import { Entity, Column, PrimaryGeneratedColumn,  BeforeInsert, BeforeUpdate} from 'typeorm';
import { Exclude, classToPlain } from 'class-transformer';

const  argon2  = require('argon2');



@Entity() 
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column({ unique: true })
  email: string;
  @Exclude()
  @Column()
  password: string;
  @Column({ type: 'bigint', unique: true, nullable: true })
  phoneNumber: number;
  @Column({ nullable: true })
  zipCode: number;
  @Column()
  address: string;
  @Column({ default: 'Admin' })
  role: string;
  @Column({ nullable: true })
  avatar: string;
  @Column({ default: false })
  active: boolean;
  @Column({ default: false })
  accepted: boolean;
  @Column({ nullable: true })
  socketId: string;
  @Column({ nullable: true })
  resetPasswordToken: string;
  @Column({ nullable: true })
  resetPasswordTime: Date;
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
