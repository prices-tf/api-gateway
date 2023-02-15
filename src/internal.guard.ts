import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { INTERNAL_KEY } from './auth/constants/internal.constant';
import isPrivateIP from 'private-ip';
import { FastifyRequest } from 'fastify';

@Injectable()
export class InternalGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isInternal = this.reflector.get<boolean>(
      INTERNAL_KEY,
      context.getHandler(),
    );

    // Check if isInternal is undefined / false
    if (!isInternal) {
      return true;
    }

    const req = context.switchToHttp().getRequest<FastifyRequest>();

    // Only allow private ips
    return isPrivateIP(req.ip);
  }
}
