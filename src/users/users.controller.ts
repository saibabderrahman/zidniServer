import { UsersService } from './users.service';
import { Controller, Post, Req, Res,UseInterceptors,UploadedFile , Body, Get, Param,  HttpStatus, ParseIntPipe, Query } from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { userDto } from './Dto';



@Controller('users')
export class UsersController {
    constructor(private userService:UsersService){}
    @Post("signUp")
    @UseInterceptors(FileInterceptor('file'))
    async StudentSignUp(@Res() res:Response,@UploadedFile() file: Express.Multer.File , @Body() Dto:userDto){
             if(file){
              Dto.avatar=  file.filename
             }
            const user = await this.userService.Createstudent(Dto)
            if(user.access_token){
              res.status(201).json({ user, message:"thank you for working with us"})
            }else{
              res.status(400).json(user)
            }
  }
    @Post("signin")
    async StudentSignin( @Body() Dto:{email:string,password:string}){
        const user = await this.userService.Login(Dto)
        return user
      
    }
    @Get("")
    async findAllStudent(
      @Query('page', ParseIntPipe) page = 1,
      @Query('limit', ParseIntPipe) limit = 10,

  ){
      const options = { page, limit };

      const student = await this.userService.findAll(options)
      return student
    }
    @Get(':id')
    async findOneWithClasses(@Param('id') id: number) {
        return this.userService.findOne(id);
    }
    @Post("admin/create")
    @UseInterceptors(FileInterceptor('file'))
    async StudentCreateByAdmin(@Res() res:Response,@UploadedFile() file: Express.Multer.File , @Body() Dto:userDto){
             if(file){
              Dto.avatar=  file.filename
             }
            const user = await this.userService.Createstudent(Dto)
            if(user.access_token){
              res.status(201).json({ user, message:"user create successfully"})
            }else{
              res.status(400).json(user)
            }
  }
}
