import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';
import { Teacher } from '../../typeorm/entities/Teacher';
import { Repository } from 'typeorm';

@Injectable()

export class JwtStrategy extends PassportStrategy(
  Strategy,
  'jwt',
) {
  constructor(  @InjectRepository(Teacher)
  private teacherRepository: Repository<Teacher> ) {
    super({
      jwtFromRequest:
       ExtractJwt.fromAuthHeaderAsBearerToken(),
       secretOrKey: process.env.JWT_SECRET,
    });
  }



  async validate(payload:{
    sub: number;
    email: string;
  }) {
    const user =
      await this.teacherRepository.findBy({
          id: payload.sub,
      });
    return user;
  }
}
