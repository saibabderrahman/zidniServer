import { Test, TestingModule } from '@nestjs/testing';
import { QuranTafseerService } from './quran-tafseer.service';

describe('QuranTafseerService', () => {
  let service: QuranTafseerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuranTafseerService],
    }).compile();

    service = module.get<QuranTafseerService>(QuranTafseerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
