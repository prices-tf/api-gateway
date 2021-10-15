import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { FastifyRequest } from 'fastify';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  throwThrottlingException(context: ExecutionContext) {
    throw new HttpException('Rate limit exceeded', 429);
  }

  getTracker(req: FastifyRequest): string {
    return req.ips?.length > 0 ? req.ips[0] : req.ip;
  }
}
