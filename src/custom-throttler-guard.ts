import { ThrottlerGuard } from '@nestjs/throttler';
import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  throwThrottlingException() {
    throw new HttpException('Rate limit exceeded', 429);
  }

  protected getTracker(req: Record<string, any>): string {
    return req.ips?.length ? req.ips[0] : req.ip;
  }
}
