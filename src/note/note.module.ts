import { Module } from '@nestjs/common';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from 'src/typeorm/entities/Notes';
import { SolutionModule } from 'src/solution/solution.module';

@Module({
  imports:[TypeOrmModule.forFeature([Note]) ,SolutionModule],

  controllers: [NoteController],
  providers: [NoteService]
})
export class NoteModule {}
