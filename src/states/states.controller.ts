import { Controller, Get, Param, Post } from '@nestjs/common';
import { StatesService } from './states.service';

@Controller('states')
export class StatesController {
    constructor(private readonly StatesService:StatesService){}


    @Post("")
    async create():Promise<void>{
        return this.StatesService.createWilaya()
    } 
    @Get("")
    async get(){
        return this.StatesService.findAllWilayats()
    } 
    @Get(":id")
    async getByID(@Param("id") id:number){
        return this.StatesService.findByID(id)
    } 
}
