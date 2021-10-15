import {
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { Refresh } from '../snapshots/interfaces/refresh.interface';
import { Paginated } from '../common/interfaces/paginated.interface';
import { SnapshotsService } from '../snapshots/snapshots.service';
import { GetPricesDto } from './dto/get-prices.dto';
import { Price } from './interfaces/price.interface';
import { PricesService } from './prices.service';

@Controller('prices')
export class PricesController {
  constructor(
    private readonly priceService: PricesService,
    private readonly snapshotService: SnapshotsService,
  ) {}

  @Get()
  private getAll(
    @Query(
      new ValidationPipe({
        transform: true,
      }),
    )
    query: GetPricesDto,
  ): Promise<Paginated<Price>> {
    return this.priceService.getAll(query.page, query.limit, query.order);
  }

  @Get(':sku')
  private getBySKU(@Param('sku') sku: string): Promise<Price> {
    return this.priceService.getBySKU(sku);
  }

  @Post(':sku/refresh')
  @HttpCode(200)
  private refresh(@Param('sku') sku: string): Promise<Refresh> {
    return this.snapshotService.refresh(sku);
  }
}
