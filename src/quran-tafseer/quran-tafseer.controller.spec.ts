import { Test, TestingModule } from '@nestjs/testing';
import { QuranTafseerController } from './quran-tafseer.controller';

describe('QuranTafseerController', () => {
  let controller: QuranTafseerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuranTafseerController],
    }).compile();

    controller = module.get<QuranTafseerController>(QuranTafseerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
