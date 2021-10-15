import { Module } from '@nestjs/common';
import { PricesService } from './prices.service';
import { PricesController } from './prices.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { SnapshotsModule } from '../snapshots/snapshots.module';

@Module({
  imports: [HttpModule, ConfigModule, SnapshotsModule],
  providers: [PricesService],
  controllers: [PricesController],
})
export class PricesModule {}
