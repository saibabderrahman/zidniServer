import { Test, TestingModule } from '@nestjs/testing';
import { FacebookPixelController } from './facebook-pixel.controller';

describe('FacebookPixelController', () => {
  let controller: FacebookPixelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacebookPixelController],
    }).compile();

    controller = module.get<FacebookPixelController>(FacebookPixelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
