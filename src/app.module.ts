import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PricesModule } from './prices/prices.module';
import configuration from './common/config/configuration';
import { validation } from './common/config/validation';
import { SnapshotsModule } from './snapshots/snapshots.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      envFilePath: process.env.NODE_ENV === 'test' ? '.test.env' : '.env',
      load: [configuration],
      validationSchema: validation,
    }),
    PricesModule,
    SnapshotsModule,
  ],
})
export class AppModule {}
