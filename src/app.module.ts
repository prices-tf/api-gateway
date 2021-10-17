import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PricesModule } from './prices/prices.module';
import configuration, { Config } from './common/config/configuration';
import { validation } from './common/config/validation';
import { SnapshotsModule } from './snapshots/snapshots.module';
import { ThrottlerModule as NestThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CustomThrottlerGuard } from './custom-throttler.guard';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ThrottlerModule } from './throttler/throttler.module';
import { ThrottlerService } from './throttler/throttler.service';
import { HealthModule } from './health/health.module';
import { InternalGuard } from './internal.guard';

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
    HealthModule,
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
    {
      provide: APP_GUARD,
      useClass: InternalGuard,
    },
  ],
})
export class AppModule {}
