import {
    Controller, Get, Post, Delete, Put, Body, Res, HttpStatus,
    Param, HttpCode, ValidationPipe, UsePipes, UseGuards, Req,UseInterceptors,UploadedFiles, DefaultValuePipe, Query, ParseIntPipe, NotFoundException, UploadedFile,
  } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('upload-image')
export class UploadImageController {
    constructor(){}

@Post()
@UseInterceptors(FileInterceptor('file'),)

async upload(@Res() res:Response , @UploadedFile() file: Express.Multer.File){
    res.status(HttpStatus.CREATED).json(file.filename)
}
}
