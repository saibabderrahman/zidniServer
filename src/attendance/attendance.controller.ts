import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { Request } from 'express';
import { JwtGuard } from '../admin/Guard';

@Controller('attendance')
export class AttendanceController {
    constructor(private AttendanceService:AttendanceService){  }
    @Post("")
    @UseGuards(JwtGuard)
    async create(@Body() dto:{name:string ,id:number ,subject:number }){
        const data = this.AttendanceService.create(dto)
        return data
    }

    @Get("all")
    async getAll(){
        return this.AttendanceService.findAll()
    }


}
