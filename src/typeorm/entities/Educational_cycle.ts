import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn,  ManyToMany,BeforeInsert, JoinTable, Tree } from 'typeorm';
import { Type } from './Type';
import { AcaOrder } from './acaOrders';
import { Subject } from './subject';

@Entity()
export class Educational_cycle {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column('simple-array', { nullable: true })
  images:string[] = [];

  @Column()
  subDescription: string;
  @Column()
  description: string;
  @Column({ })
  type: string;
  @Column({ default: false })
  show: boolean;
  @Column()
  time: string;
  @Column({ nullable: false })
  price: number;
  @Column({ nullable: true })
  comparAtPrice: number;
  @Column({ nullable: true })
  tags: string;
  @Column({ nullable: true ,default: 5 })
  ratings: number;
  @Column({ default: 0 })
  seatsAvailable: number;
  @Column({ default: 0 })
  seatsTotal: number;
  @Column({ default: 0 })
  seatsTaken: number;
  @OneToMany(()=>AcaOrder ,  order => order.educational_cycle)
  orders:AcaOrder[]
  @Column('simple-array', { nullable: true })
  studentIds: number[] = [];
  @OneToMany(() => Subject, classes => classes.cycle)
  subjects: Subject[];
  @BeforeInsert()
  async addAvailableSeates() {
      this.seatsAvailable = this.seatsTotal;
  }

}
