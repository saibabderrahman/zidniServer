import { Test, TestingModule } from '@nestjs/testing';
import { FacebookPixelService } from './facebook-pixel.service';

describe('FacebookPixelService', () => {
  let service: FacebookPixelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FacebookPixelService],
    }).compile();

    service = module.get<FacebookPixelService>(FacebookPixelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
