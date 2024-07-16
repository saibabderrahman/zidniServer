import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationStateService } from './registration-state.service';

describe('RegistrationStateService', () => {
  let service: RegistrationStateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegistrationStateService],
    }).compile();

    service = module.get<RegistrationStateService>(RegistrationStateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
