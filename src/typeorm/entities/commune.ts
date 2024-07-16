
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Wilaya } from './Wilaya';

@Entity()
export class Commune {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 50 ,unique:false})
  name: string;
  @ManyToOne(() => Wilaya, (city) => city.communes)
  @JoinColumn({ name: 'city_id' })
  wilaya:Wilaya;
}
