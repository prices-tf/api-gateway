import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import {
  DISABLE_AUTH_KEY,
  DISABLE_JWT_AUTH_KEY,
} from './constants/disable-auth.constant';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const disabledJwtAuth = this.reflector.getAllAndOverride<boolean>(
      DISABLE_JWT_AUTH_KEY,
      [context.getHandler(), context.getClass()],
    );

    const disabledAuth = this.reflector.getAllAndOverride<boolean>(
      DISABLE_AUTH_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (disabledJwtAuth || disabledAuth) {
      return true;
    }

    return super.canActivate(context);
  }
}
