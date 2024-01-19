import { Test, TestingModule } from '@nestjs/testing';
import { TypeEducationController } from './type_education.controller';

describe('TypeEducationController', () => {
  let controller: TypeEducationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeEducationController],
    }).compile();

    controller = module.get<TypeEducationController>(TypeEducationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
