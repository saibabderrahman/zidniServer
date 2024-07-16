
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
  } from 'typeorm';
import {Commune } from './commune';


  
  @Entity()
  export class Wilaya {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ length: 50 ,unique:true})
    name: string;
    @OneToMany(() => Commune, (Item) => Item.wilaya, { cascade: true })
    communes:Commune[];
  }
  