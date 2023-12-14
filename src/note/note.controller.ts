import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteDto } from './dto/note.dto';
import { JwtGuard } from 'src/admin/Guard';

@Controller('note')
export class NoteController {
    constructor(private readonly NoteService:NoteService){}
    @Post()
    @UseGuards(JwtGuard)
    async create(@Body() dto:NoteDto){
        return this.NoteService.createNote(dto)
    }
}
