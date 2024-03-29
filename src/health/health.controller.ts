import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { InternalOnly } from '../auth/decorators/internal.decorator';
import { DisableAuth } from '../auth/decorators/disable-auth.decorator';
import { SkipThrottle } from '@nestjs/throttler';

@ApiExcludeController(true)
@DisableAuth()
@InternalOnly()
@SkipThrottle(true)
@Controller('health')
export class HealthController {
  constructor(private health: HealthCheckService) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([]);
  }
}
