import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PricesModule } from './prices/prices.module';
import configuration, { Config } from './common/config/configuration';
import { validation } from './common/config/validation';
import { SnapshotsModule } from './snapshots/snapshots.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CustomThrottlerGuard } from './custom-throttler.guard';

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
        const throttleConfig = configService.get('throttle');
        return {
          ttl: throttleConfig.ttl,
          limit: throttleConfig.limit,
        };
      },
    }),
    PricesModule,
    SnapshotsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {}
