import { Test, TestingModule } from '@nestjs/testing';
import { TypeEducationService } from './type_education.service';

describe('TypeEducationService', () => {
  let service: TypeEducationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypeEducationService],
    }).compile();

    service = module.get<TypeEducationService>(TypeEducationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
