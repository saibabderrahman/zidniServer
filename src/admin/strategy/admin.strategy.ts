import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';
import { Admin   } from '../../typeorm/entities/Admin';
import { Repository } from 'typeorm';

@Injectable()

export class JwtStrategy extends PassportStrategy(
  Strategy,
  'jwt',
) {
  constructor(  @InjectRepository(Admin)
  private AdminRepository: Repository<Admin> ) {
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
      await this.AdminRepository.findBy({
          id: payload.sub,
      });
    return user;
  }
}
