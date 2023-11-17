import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';
import { User } from '../../typeorm/entities/User';
import { Repository } from 'typeorm';

@Injectable()

export class JwtStrategy extends PassportStrategy(
  Strategy,
  'jwtToken',
) {
  constructor(  @InjectRepository(User)
  private UserRepository: Repository<User> ) {
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
      await this.UserRepository.findBy({
          id: payload.sub,
      });
    return user;
  }
}
