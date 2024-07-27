import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MessengerRegistrationState {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'bigint', nullable: true })
  chatId: string;  
  @Column({ default:0 })
  counter: number; 
  @Column({nullable:true})
  education:number
  @Column({nullable:true})
  step: string;
  @Column({nullable:true})
  apiToken:string
  @Column({ type: 'json' })
  data: Record<string, any>;

}
