import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PricesModule } from './prices/prices.module';
import configuration, {
  Config,
  ThrottleConfig,
} from './common/config/configuration';
import { validation } from './common/config/validation';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { HealthModule } from './health/health.module';
import { InternalGuard } from './internal.guard';
import { HistoryModule } from './history/history.module';
import { ThrottlerModule as NestThrottlerModulee } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { CustomThrottlerGuard } from './custom-throttler-guard';
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
    NestThrottlerModulee.forRootAsync({
      imports: [ConfigModule, ThrottlerModule],
      inject: [ConfigService, ThrottlerService],
      useFactory: (
        configService: ConfigService<Config>,
        throttlerService: ThrottlerService,
      ) => {
        const throttleConfig = configService.get<ThrottleConfig>('throttle');
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
    HistoryModule,
    AuthModule,
    ThrottlerModule,
  ],
  providers: [
    {
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
