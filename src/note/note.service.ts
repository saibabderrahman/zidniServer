import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SolutionService } from 'src/solution/solution.service';
import { Note } from 'src/typeorm/entities/Notes';
import { Repository } from 'typeorm';
import { NoteDto } from './dto/note.dto';

@Injectable()
export class NoteService {
    constructor(@InjectRepository(Note) private NoteRepository: Repository<Note>,   
    private readonly SolutionService:SolutionService,
    ){}




    async createNote(data:NoteDto){
        try {

            const solution = await this.SolutionService.getSolutionById(data.solution)


            if(solution.notes){
                throw new BadRequestException("لقد قمت بالفعل بإنشاء ملاحضة لهذا الواجب")
            }

            const note = await this.NoteRepository.save({...data,solution})
            return note
        } catch (error) {
            throw new BadRequestException(error.message || 'Failed to create solution.');

            
        }
    }
}
