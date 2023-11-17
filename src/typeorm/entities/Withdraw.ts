import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Teacher} from './Teacher';

@Entity()
export class Withdraw {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  bankName: string;
  @Column({ nullable: true })
  bankAccountNumber: number;
  @Column({ nullable: true })
  bankHolderName: string;
  /* @ManyToOne(() => Teacher, shop => shop.Withdraws)
  Seller: Teacher; */
  @Column()
  amount: number;
  @Column({ default: 'Processing' })
  status: string;
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;
}
