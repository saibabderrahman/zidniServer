import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Lesson } from '../typeorm/entities/Lesson';
import { Subject } from 'src/typeorm/entities/subject';
import { LessonDto } from './dto';
import { Options, queryAndPaginate } from 'src/utility/helpers.utils';


@Injectable()
export class LessonService {
    constructor(    @InjectRepository(Subject) private subjectRepository: Repository<Subject>,
    @InjectRepository(Lesson) private LessonRepository: Repository<Lesson>,
){}

async CreateLesson(data:LessonDto){
    try {

        const queryBuild = await this.subjectRepository.createQueryBuilder('Subject')
        .leftJoinAndSelect('Subject.Level', 'Level')
        .leftJoinAndSelect('Subject.Category', 'Category')
        .leftJoinAndSelect('Subject.cycle', 'cycle')
        .leftJoinAndSelect('cycle.orders', 'orders')
        .leftJoinAndSelect('Subject.teacher', 'teacher')
        .where(`Subject.id = :id `,{id:data.id} )
        .getOne()

        if(!queryBuild){
            throw new ForbiddenException('this class not exist')
        }

        const orders = queryBuild.cycle.orders.filter((item)=>item.status === "paid" )
        if(orders.length === 0){
          throw new ForbiddenException("You cannot create a lesson for this class because it doesn't have any students.");
        }
       const today = new Date();
       const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
       const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
       const existingLesson = await this.LessonRepository.findOne({
         where: {
           subject: {id:data.id},
           createdAt: Between(startOfToday, endOfToday)
          }
        });
        
        if (existingLesson) {
          throw new ForbiddenException('A lesson already exists today for this class');
        }
         const Lesson = await this.LessonRepository.create({subject:queryBuild ,name:data.name,url:data.url ,platform:data.platform})
         const lessons = await this.LessonRepository.save(Lesson)
         return {success:true}
        
    } catch (error) {
       throw new ForbiddenException(error)

        
    }
}


async findAll(options:Options){
  try {
      const queryBuild = await this.LessonRepository.createQueryBuilder('lesson')
      .leftJoinAndSelect("lesson.subject" ,"subject")
      .leftJoinAndSelect("lesson.duty" ,"duty")
      const { limit , page } = options;
      const offset = (page - 1) * limit || 0;
      const { totalCount, hasMore, data } = await queryAndPaginate(queryBuild, offset, limit);

      return {
          page: options.page || 1,
          limit: limit,
          totalCount: totalCount,
          data: data,
          hasMore: hasMore,
        }; 

  } catch (error) {
      if(error.message){
          throw new BadRequestException(error.message)
      }
      throw new BadRequestException(error.message)  

      
  }
  
}
async  getClasses() {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    const classesQuery = this.LessonRepository.createQueryBuilder('class')
      .leftJoinAndSelect('class.subject', 'subject')
      .leftJoinAndSelect('subject.teacher', 'teacher')
      .leftJoinAndSelect('subject.Level', 'Level')
      .leftJoinAndSelect('subject.Category', 'Category')
      .leftJoinAndSelect('subject.cycle', 'cycle')
      .leftJoinAndSelect('cycle.orders', 'orders')
      .leftJoinAndSelect('orders.educational_cycle', 'educational_cycle')
      .leftJoinAndSelect('educational_cycle.subjects', 'subjects')
      .leftJoinAndSelect('subject.lessons', 'lessons')
      .leftJoinAndSelect('orders.user', 'user')
      .leftJoinAndSelect('orders.Attendance', 'Attendance')
      .where('class.createdAt BETWEEN :start AND :end', { start: startOfDay, end: endOfDay })
      .andWhere('class.state = :state', { state: 'start' })
      .andWhere('orders.status = :status', { status: 'paid' });
       const classes = await classesQuery.getMany();
       const newClasses = classes.map(({ subject, ...rest }) => ({
         ...rest,
         subject: {
           ...subject,
           cycle: {
             ...subject.cycle,
             orders: subject.cycle.orders.map((e) => ({
               ...e,
               educational_cycle: {
                 ...e.educational_cycle,
                 subjects: e.educational_cycle.subjects.find((item) => item.id === subject.id),
               },
             })),
           },
         },
       }));

    return { success: true, classes: newClasses };
  } catch (error) {

    if (error.sqlMessage) {
      throw new ForbiddenException(error.sqlMessage)
    }

    throw new ForbiddenException(error.message)
  }
}

async  getLessonsToday(options:Options , id:number) {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    const classesQuery = this.LessonRepository.createQueryBuilder('class')
      .leftJoinAndSelect('class.subject', 'subject')
      .leftJoinAndSelect('subject.teacher', 'teacher')
      .leftJoinAndSelect('subject.Level', 'Level')
      .leftJoinAndSelect('subject.Category', 'Category')
      .leftJoinAndSelect('subject.cycle', 'cycle')
      .leftJoinAndSelect('cycle.orders', 'orders')
      .leftJoinAndSelect('orders.educational_cycle', 'educational_cycle')
      .leftJoinAndSelect('orders.user', 'user')
      .leftJoinAndSelect('orders.Attendance', 'Attendance')
      .select(["class"  ,"teacher.lastName" ,"teacher.firstName" ,"Level.name","Category.name","educational_cycle.name"   , "subject.name","subject.start" ,"subject.end"])
      .where('class.createdAt BETWEEN :start AND :end', { start: startOfDay, end: endOfDay })
      .andWhere('user.id = :id' ,{id})
      
      const { limit , page } = options;
      const offset = (page - 1) * limit || 0;
      const { totalCount, hasMore, data } = await queryAndPaginate(classesQuery, offset, limit);

      return {
          page: options.page || 1,
          limit: limit,
          totalCount: totalCount,
          data: data,
          hasMore: hasMore,
        }; 
  
  } catch (error) {

    if (error.sqlMessage) {
      throw new ForbiddenException(error.sqlMessage)
    }

    throw new ForbiddenException(error.message)
  }
}

async findOneByID(id:number):Promise<Lesson>{
  try {
    const queryBuild = await this.LessonRepository.createQueryBuilder('lesson')
    .leftJoinAndSelect("lesson.Attendance" ,"Attendance")
    .leftJoinAndSelect("Attendance.order" ,"order")
    .where("lesson.id = :id",{id})
    .getOne()

    return queryBuild

  } catch (error) {
    if(error.message){
      throw new BadRequestException(error.message)
  }
  throw new BadRequestException(error.message)  

    
  }
}


async updateOneByID(id:number){
  try {
    let lesson = await this.LessonRepository.findOne({where:{id}})
    if(!lesson){
      throw new ForbiddenException('this lesson not exist')
    }
     lesson.state= "end"
     await this.LessonRepository.save(lesson)
    return {success:true}
  } catch (error) {
    if (error.sqlMessage) {
      throw new ForbiddenException(error.sqlMessage)
    }

    throw new ForbiddenException(error.message)
    
  }

}
  
  
}


















    /* const subQuery = this.ClassRepository.createQueryBuilder('class')
    .leftJoin('class.Lessons', 'lesson')
    .where('lesson.createdAt BETWEEN :start AND :end', { start: startOfToday, end: endOfToday })
    .andWhere('lesson.state = :state', { state: 'start' })
    .select('class.id')
    .getQuery();
    console.log(subQuery)

  const classes = await this.ClassRepository.createQueryBuilder('class')
    .leftJoinAndSelect('class.teacher', 'teacher')
    .leftJoinAndSelect('class.Level', 'Level')
    .leftJoinAndSelect('class.Category', 'Category')
    .leftJoinAndSelect('class.orders', 'orders')
    .leftJoin('orders.user', 'user') // Update to leftJoin instead of leftJoinAndSelect
    .leftJoinAndSelect('class.Lessons', 'Lessons')
    .select(['class', 'teacher.firstName', 'teacher.lastName' ,'Category.name','Level.name', "orders",'user' , 'Lessons'])
    .where(`class.id  IN (${subQuery})`)
    .andWhere('orders.status = :status', { status: 'paid' }) 

    .setParameters({ start: startOfToday, end: endOfToday, state: 'start' })
    .getMany(); 
    
    return {success:true,classes};
    */