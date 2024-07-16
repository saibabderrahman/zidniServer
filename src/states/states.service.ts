import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Commune, Wilaya } from 'src/typeorm/entities';
import { Repository } from 'typeorm';
import { wilayatNew } from './data/wilayat';
import { LoggerService } from 'src/logger.service';
import { handleError } from 'src/utility/helpers.utils';

@Injectable()
export class StatesService {

    constructor(@InjectRepository(Wilaya) private readonly WilayaRepository:Repository<Wilaya>,
    @InjectRepository(Commune) private readonly CommuneRepository:Repository<Commune>,
    private readonly logger:LoggerService
){}



async createWilaya():Promise<void>{
    try {
        await this.WilayaRepository.save(wilayatNew)
    } catch (error) {
        handleError('Error in create wilayat function', error,this.logger,"statesDelivery");    
    }
}

async findAllWilayats(){
    try {
        const wilaya = await this.WilayaRepository.find()
        return wilaya
      } catch (error) {
        handleError('Error in FindAll wilayats function', error,this.logger,"statesDelivery");    
    }
}

async findByID(id:number){
    try {

        const communes = await this.CommuneRepository.createQueryBuilder("commune")
        .leftJoinAndSelect("commune.wilaya","wilaya")
        .where("wilaya.id = :id" ,{id})
        .select(["commune"])
        .getMany()

        return communes

    } catch (error) {
        handleError('Error in findBy Id function', error,this.logger,"statesDelivery");    
     
    }
}
}
