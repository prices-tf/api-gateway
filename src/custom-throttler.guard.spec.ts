import { Reflector } from '@nestjs/core';
import { ThrottlerStorageService } from '@nestjs/throttler';
import { CustomThrottlerGuard } from './custom-throttler.guard';

describe('CustomThrottlerGuard', () => {
  it('should be defined', () => {
    expect(
      new CustomThrottlerGuard(
        {},
        new ThrottlerStorageService(),
        new Reflector(),
      ),
    ).toBeDefined();
  });
});
