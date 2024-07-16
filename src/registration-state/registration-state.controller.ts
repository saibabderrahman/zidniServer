import { Controller, Get, Param, Post, Body, NotFoundException, Delete } from '@nestjs/common';
import { RegistrationStateService } from './registration-state.service';
import { RegistrationState } from 'src/typeorm/entities';

@Controller('registration-states')
export class RegistrationStateController {
  constructor(private readonly registrationStateService: RegistrationStateService) {}


  @Get()
  async findAll(): Promise<RegistrationState[]> {
    try {
      return await this.registrationStateService.findAll();
    } catch (error) {
      // Handle specific errors or log them
      throw error;
    }
  }

  @Delete(':chatId')
  async findOne(@Param('chatId') chatId: number){
    try {
      return await this.registrationStateService.remove(chatId);
    } catch (error) {
      // Handle specific errors or log them
      throw error;
    }
  }

  // Implement update and delete endpoints similarly
}
