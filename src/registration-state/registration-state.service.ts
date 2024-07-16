import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegistrationState } from 'src/typeorm/entities';
import { Repository } from 'typeorm';

@Injectable()
export class RegistrationStateService {
  constructor(
    @InjectRepository(RegistrationState)
    private readonly registrationStateRepository: Repository<RegistrationState>,
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
}
