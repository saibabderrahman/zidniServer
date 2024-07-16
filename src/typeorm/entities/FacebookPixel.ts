
import {
    Column,
    Entity,  
    PrimaryGeneratedColumn,
  } from 'typeorm';  
  @Entity()
  export class FacebookPixel {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ })
    name: string;
    @Column({type:"longtext" })
    access_token: string;
    @Column()
    pixel_id: string;
    @Column()
    domainVerification:string
    @Column({default:true})
    status:boolean

  }
  