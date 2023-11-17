import { Controller, Post, Req, Res,UseInterceptors,UploadedFile , Body, Get, Param, HttpException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { Response } from 'express';
import { TeacherDto } from './Dto';
import { FileInterceptor } from '@nestjs/platform-express';




@Controller('teacher')
export class TeacherController {
    constructor(private teacherService:TeacherService){}


    @Get('')
    async findAll(
        @Query('page', ParseIntPipe) page = 1,
        @Query('limit', ParseIntPipe) limit = 10,

    ){
        const options = { page, limit };

        const categories = await this.teacherService.findAll(options)
        return categories
    }

    @Post("signUp")
    @UseInterceptors(FileInterceptor('file'))
    async TeacherSignUp(@Res() res:Response,@UploadedFile() file: Express.Multer.File , @Body() Dto:TeacherDto){
             if(file){
              Dto.avatar=  file.filename
             }
            const user = await this.teacherService.CreateTeacher(Dto)
            if(user.access_token){
              res.status(201).json({ user, message:"thank you for working with us"})
            }else{
              res.status(400).json(user)
            }
    
     }
    @Post("signin")
    async TeacherSignin(@Res() res:Response, @Body() Dto){
        const user = await this.teacherService.Login(Dto)
        if(user.token){
          res.status(201).json({ user, message:"welcome"})
        }else{
          res.status(400).json(user)
        }
    }
    @Get('getone/:id')
    async findOneWithClasses(@Param('id') id: number) {
        return this.teacherService.findOne(id);
    }
    @Post("admin/create")
    @UseInterceptors(FileInterceptor('file'))
    async AdminCreateTeacher(@UploadedFile() file: Express.Multer.File , @Body() Dto:TeacherDto){
             if(file){
              Dto.avatar=  file.filename
             }
            const user = await this.teacherService.AdminCreate(Dto)
            return user
   
    
     }
}
