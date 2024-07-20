import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RegistrationState {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'bigint', nullable: true })
  chatId: number;  
  @Column()
  education:number
  @Column({nullable:true})
  step: string;
  @Column({nullable:true})
  apiToken:string
  @Column({ type: 'json' })
  data: Record<string, any>;

}
