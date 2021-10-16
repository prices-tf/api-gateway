import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PricesModule } from './prices/prices.module';
import configuration, {
  Config,
  RedisConfig,
} from './common/config/configuration';
import { validation } from './common/config/validation';
import { SnapshotsModule } from './snapshots/snapshots.module';
import { ThrottlerModule as NestThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CustomThrottlerGuard } from './custom-throttler.guard';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { AuthModule } from './auth/auth.module';
import * as Redis from 'ioredis';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ThrottlerModule } from './throttler/throttler.module';
import { ThrottlerService } from './throttler/throttler.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      envFilePath: process.env.NODE_ENV === 'test' ? '.test.env' : '.env',
      load: [configuration],
      validationSchema: validation,
    }),
    NestThrottlerModule.forRootAsync({
      imports: [ConfigModule, ThrottlerModule],
      inject: [ConfigService, ThrottlerService],
      useFactory: (
        configService: ConfigService<Config>,
        throttlerService: ThrottlerService,
      ) => {
        const throttleConfig = configService.get('throttle');

        return {
          ttl: throttleConfig.ttl,
          limit: throttleConfig.limit,
          storage: new ThrottlerStorageRedisService(
            throttlerService.getRedis(),
          ),
        };
      },
    }),
    PricesModule,
    SnapshotsModule,
    AuthModule,
    ThrottlerModule,
  ],
  providers: [
    {
      // Throttle all requests
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
    {
      // Require auth by default
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
