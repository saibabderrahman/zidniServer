import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessengerRegistrationState, RegistrationState } from 'src/typeorm/entities';
import { Repository } from 'typeorm';

@Injectable()
export class RegistrationStateService {
  constructor(
    @InjectRepository(RegistrationState)
    private readonly registrationStateRepository: Repository<RegistrationState>,
    @InjectRepository(MessengerRegistrationState) private readonly MessengerRegistrationStateRepository: Repository<MessengerRegistrationState>,
  ) {}

  

  async findAll(): Promise<RegistrationState[]> {
    try {
      return await this.registrationStateRepository.find();
    } catch (error) {
      throw error;
    }
  }




  async remove(id): Promise<void> {
    try {
      const state = await this.registrationStateRepository.findOne({ where: { id } });
      if (!state) {
        throw new NotFoundException(`Registration state with chatId ${id} not found`);
      }
      await this.registrationStateRepository.remove(state);
    } catch (error) {
      throw error;
    }
  }

  async findByCHatID(chatId:number,education:number):Promise<RegistrationState>{
    try {
      let state = await this.registrationStateRepository.findOne({ where: { chatId ,education } });
      if(!state) throw new NotFoundException("not found")
      return state
    } catch (error) {
      throw new NotFoundException("not found")
    }
  }
  async findByCHatIDMessenger(chatId:number):Promise<RegistrationState>{
    try {
      let state = await this.registrationStateRepository.findOne({ where: { chatId  } });
      return state
    } catch (error) {

    }
  }
  async save(state:RegistrationState):Promise<void>{
    try {
       await this.registrationStateRepository.save(state)
      return 
    } catch (error) {
      throw new NotFoundException("not found")
    }
  }
}
