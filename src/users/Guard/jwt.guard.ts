import { AuthGuard } from '@nestjs/passport';

export class JwtGuard extends AuthGuard('jwtToken') {
  constructor() {
    super();
  }
}