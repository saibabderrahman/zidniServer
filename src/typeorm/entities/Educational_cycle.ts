import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn,  ManyToMany,BeforeInsert, JoinTable, Tree } from 'typeorm';
import { Type } from './Type';
import { AcaOrder } from './acaOrders';
import { Subject } from './subject';
import { Type_Education } from './typeOfEducation';

@Entity()
export class Educational_cycle {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column('simple-array', { nullable: true })
  images:string[] = [];
  @Column({type:"longtext" ,nullable:true})
  subDescription: string;
  @Column({type:"longtext" ,nullable:true})
  description: string;
  @Column({nullable:true})
  type: string;
  @Column({ default: true })
  show: boolean;
  @Column({ default: true })
  status: boolean;
  @Column()
  time: string;
  @Column({ nullable: false })
  price: number;
  @Column({ nullable: true ,default: 5 })
  ratings: number;
  @Column({ default: 0 })
  seatsAvailable: number;
  @Column({ default: 0 })
  seatsTotal: number;
  @ManyToOne((type) => Type_Education)
  type_Education: Type_Education;
  @Column({ default: 0 })
  seatsTaken: number;
  @OneToMany(()=>AcaOrder ,  order => order.educational_cycle)
  orders:AcaOrder[]
  @Column('simple-array', { nullable: true })
  studentIds: number[] = [];
  @Column('simple-array', { nullable: true })
  levels:string[];
  @OneToMany(() => Subject, classes => classes.cycle)
  subjects: Subject[];
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
  @BeforeInsert()
  async addAvailableSeates() {
      this.seatsAvailable = this.seatsTotal;
  }

}
