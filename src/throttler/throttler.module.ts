import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerService } from './throttler.service';

@Module({
  imports: [ConfigModule],
  providers: [ThrottlerService],
  exports: [ThrottlerService],
})
export class ThrottlerModule {}
