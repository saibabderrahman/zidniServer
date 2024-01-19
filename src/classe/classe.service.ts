import { ForbiddenException, Injectable } from '@nestjs/common';
import { Classes } from '../typeorm/entities/Classes';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassesDto } from './dto/classes.dto';

@Injectable()
export class ClasseService {
    constructor (
        @InjectRepository(Classes)  private classRepository: Repository<Classes>

    ){}


    public async createClass(Dto){
        try {
            const classes = await this.classRepository.create(Dto)
            if(!classes){
                throw new ForbiddenException('something went wrong ')
            }

           const data = await this.classRepository.save(classes)
           return data
        } catch (error) {
            ;
            if (error.sqlMessage) {
                return error.sqlMessage;
            }
            return error.message;
        }
    }

    public async findOne(id){
        try {
            const data = await this.classRepository.findOne({relations: ['teacher' , 'Level' ,"Category","student", "orders","Lessons" ]  ,where:{id}})
            return data
        } catch (error) {
            return error.message
        }
    }
    public async UpdateOne(id: number, data: ClassesDto) {
        try {
            const { name, description, benefit, Category, Level, start, end, day, time ,priceTotal} = data;
    
            const className = await this.classRepository.findOneBy({ id });
    
            if (!className) {
                throw new ForbiddenException('This class does not exist');
            }
    
            if (name) {
                className.name = name;
            }
    
            if (description) {
                className.description = description;
            }
    
            if (benefit) {
                className.benefit = benefit;
            }
    
            if (Category) {
                className.Category = Category;
            }
    
            if (Level) {
                className.Level = Level;
            }
    
            if (start) {
                className.start = start;
            }
    
            if (end) {
                className.end = end;
            }
    
            if (day) {
                className.day = day;
            }
    
            if (time) {
                className.time = time;
            }
            if (priceTotal) {
                className.priceTotal = priceTotal;
            }
    
            className.schoolPrice = Number(className.priceTotal) * (className.benefit / 100);
            className.TeacherPrice = Number(className.priceTotal) - className.schoolPrice;
            className.show = true;
    
            const Data = await  this.classRepository.save(className);
            return Data
        } catch (error) {
            if (error.sqlMessage) {
                return error.sqlMessage;
            }
            return error.message;
        }
    }
    
    ///
    public async DeleteOne(id){
        try {
            const className = await this.classRepository.findOneBy({id})
            if(!className){
                throw new ForbiddenException('this class not exist')
            } 
            const data = await this.classRepository.delete({id})
            return {message:"class Delete Successfully"}
        } catch (error) {
            ;
            if (error.sqlMessage) {
                return error.sqlMessage;
            }
            return error.message;
        }
    }
    public async findAll(){
        try {
            const data = await this.classRepository.find({relations: ['teacher' , 'Level' ,"Category","Lessons"] })
            return data
        } catch (error) {
            ;
            if (error.sqlMessage) {
                return error.sqlMessage;
            }
            return error.message;

        }
    }
}
