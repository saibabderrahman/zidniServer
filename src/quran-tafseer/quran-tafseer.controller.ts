import { Controller, Get, Param } from '@nestjs/common';
import { QuranTafseerService } from './quran-tafseer.service';

@Controller('quran-tafseer')
export class QuranTafseerController {
  constructor(private readonly quranTafseerService: QuranTafseerService) {}

  @Get('')
  async getTafseerData(
  ) {
    const tafseerData = await this.quranTafseerService.getTafseerData();
    return tafseerData;
  }
}
