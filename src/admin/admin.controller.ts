import { Controller, Post, Req, Res,UseInterceptors,UploadedFile , Body, Get, Param,  HttpStatus, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AdminDto } from './Dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminService } from './admin.service';
import { ClassesDto } from '../classe/dto/classes.dto';
import { JwtGuard } from './Guard';


@Controller('admin')
export class AdminController {

    constructor(private adminService:AdminService){}

    @Post("signUp")
    @UseInterceptors(FileInterceptor('file'))
    async AdminSignUp(@Res() res:Response,@UploadedFile() file: Express.Multer.File , @Body() Dto:AdminDto){
             if(file){
              Dto.avatar=  file.filename
             }
            const user = await this.adminService.Createadmin(Dto)
            if(user.access_token){
              res.status(201).json({ user, message:"thank you for working with us"})
            }else{
              res.status(400).json(user)
            }
    
  }
    @Post("signin")
    async AdminSignin(@Res() res:Response, @Body() Dto){
        const user = await this.adminService.Login(Dto)
        if(user.token){
          res.status(201).json({ user, message:"welcome"})
        }else{
          res.status(400).json(user)
        }
    }
    @Get('findOne/:id')
    async findOne(@Param('id') id: number) {
        return this.adminService.findOne(id);
    }
    @Post('initialData')
    @Post('CreateClass')
    @UseGuards(JwtGuard)
    async initials(@Res() res:Response ) {
        const data = await this.adminService.initialsData();
        if(data.admins){
            res.status(200).json(data)
        }else{
          res.status(400).json(data)
        }

    }
    @Post('CreateClass')
    @UseGuards(JwtGuard)
    async CreateClass(@Res() res:Response , @Body() dto:ClassesDto ) {
        const data = await this.adminService.CreateClass(dto);
        if(data.success){
            res.status(200).json(data)
        }else{
          res.status(400).json(data)
        }
    }

}
