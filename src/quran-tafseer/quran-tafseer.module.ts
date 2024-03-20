import { Module } from '@nestjs/common';
import { QuranTafseerService } from './quran-tafseer.service';
import { QuranTafseerController } from './quran-tafseer.controller';

@Module({
  providers: [QuranTafseerService],
  controllers: [QuranTafseerController]
})
export class QuranTafseerModule {}
