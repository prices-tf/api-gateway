import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { SkipThrottle } from '@nestjs/throttler';
import { InternalOnly } from '../auth/decorators/internal.decorator';
import { DisableAuth } from '../auth/decorators/disable-auth.decorator';

@ApiExcludeController(true)
@SkipThrottle(true)
@DisableAuth()
@InternalOnly()
@Controller('health')
export class HealthController {
  constructor(private health: HealthCheckService) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([]);
  }
}
