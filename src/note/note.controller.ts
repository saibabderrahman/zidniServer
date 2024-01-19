import { Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteDto } from './dto/note.dto';
import { JwtGuard } from 'src/admin/Guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('note')
export class NoteController {
    constructor(private readonly NoteService:NoteService){}
    @Post()
    @UseInterceptors(FileInterceptor('audioFile'))
    @UseGuards(JwtGuard)
  
    async create(@Body() dto:NoteDto ,@UploadedFile() audioFile: Express.Multer.File ){
        if(audioFile){
            dto.record =  audioFile.filename
          }
        return this.NoteService.createNote(dto)
    }
}
