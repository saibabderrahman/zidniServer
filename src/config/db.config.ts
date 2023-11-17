import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Classes} from '../typeorm/entities/Classes';
import { Teacher } from '../typeorm/entities/Teacher';
import { Category } from '../typeorm/entities/Category';
import { Subject } from 'src/typeorm/entities/subject';
import { Educational_cycle } from 'src/typeorm/entities/Educational_cycle';
import { Type } from 'src/typeorm/entities/Type';
import { Levels } from 'src/typeorm/entities/Levels';
import { User } from 'src/typeorm/entities/User';
import { Order } from 'src/typeorm/entities/Order';
import { AcaOrder } from 'src/typeorm/entities/acaOrders';
import { Balance } from 'src/typeorm/entities/Balance';
import { Admin } from 'src/typeorm/entities/Admin';
import { Lesson } from 'src/typeorm/entities/Lesson';
import { Attendance } from 'src/typeorm/entities/Attendance';


class ConfigServiceDB {
  constructor(private ConfigService: ConfigService) {}
  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.ConfigService.get('DATABASE_HOST'),
      port: parseInt(this.ConfigService.get('DATABASE_PORT')),
      username: this.ConfigService.get('DATABASE_USERNAME'),
      password: this.ConfigService.get('DATABASE_PASSWORD'),
      database: this.ConfigService.get('DATABASE_NAME'),
      entities: [Subject,Teacher,Classes ,Type, Educational_cycle  ,Category , Levels, User,Order ,Admin,Lesson,Attendance,Balance,AcaOrder],
      subscribers: ['dist/**/*.subscriber.js'],
      synchronize: true,
      charset: "utf8mb4_unicode_ci",
    };
  }
}
const configServiceDb = new ConfigServiceDB(new ConfigService());
export { configServiceDb };
