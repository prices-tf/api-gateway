import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PricesModule } from './prices/prices.module';
import configuration, {
  Config,
  RedisConfig,
} from './common/config/configuration';
import { validation } from './common/config/validation';
import { SnapshotsModule } from './snapshots/snapshots.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CustomThrottlerGuard } from './custom-throttler.guard';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { AuthModule } from './auth/auth.module';
import * as Redis from 'ioredis';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      envFilePath: process.env.NODE_ENV === 'test' ? '.test.env' : '.env',
      load: [configuration],
      validationSchema: validation,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Config>) => {
        const queueConfig = configService.get<RedisConfig>('redis');

        let redisConfig: Redis.RedisOptions;

        if (queueConfig.isSentinel) {
          redisConfig = {
            sentinels: [
              {
                host: queueConfig.host,
                port: queueConfig.port,
              },
            ],
            name: queueConfig.set,
          };
        } else {
          redisConfig = {
            host: queueConfig.host,
            port: queueConfig.port,
            password: queueConfig.password,
          };
        }

        const throttleConfig = configService.get('throttle');

        return {
          ttl: throttleConfig.ttl,
          limit: throttleConfig.limit,
          storage: new ThrottlerStorageRedisService(redisConfig),
        };
      },
    }),
    PricesModule,
    SnapshotsModule,
    AuthModule,
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
