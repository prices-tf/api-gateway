import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  throwThrottlingException(context: ExecutionContext) {
    throw new HttpException('Rate limit exceeded', 429);
  }
}
