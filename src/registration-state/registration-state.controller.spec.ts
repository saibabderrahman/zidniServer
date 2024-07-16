import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationStateController } from './registration-state.controller';

describe('RegistrationStateController', () => {
  let controller: RegistrationStateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegistrationStateController],
    }).compile();

    controller = module.get<RegistrationStateController>(RegistrationStateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
