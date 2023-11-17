import { Classes} from '../typeorm/entities/Classes';
import { Teacher } from '../typeorm/entities/Teacher';
import { Category } from '../typeorm/entities/Category';


export const  config ={
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port:  3309,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [Teacher, Classes,Category],
    synchronize: true,
  }