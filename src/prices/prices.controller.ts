import {
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { Paginated } from '../common/interfaces/paginated.interface';
import { GetPricesDto } from './dto/get-prices.dto';
import { Price } from './interfaces/price.interface';
import { PricesService } from './prices.service';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { PriceModel } from './models/price.model';
import { PaginatedModel } from '../common/models/paginated.model';
import { ApiParamSKU } from '../common/swagger/api-param-sku.decorator';
import { CheckPriceModel } from './models/check-price.model';
import { CheckPrice } from './interfaces/check-price.interface';

@ApiTags('Prices')
@ApiBearerAuth('access-token')
@ApiExtraModels(PaginatedModel, PriceModel)
@Controller('prices')
export class PricesController {
  constructor(private readonly priceService: PricesService) {}

  @Get()
  @ApiOperation({
    summary: 'Paginate prices',
    description: 'Use page and limit to paginate prices',
  })
  @ApiOkResponse({
    status: 200,
    schema: {
      allOf: [
        {
          $ref: getSchemaPath(PaginatedModel),
        },
        {
          properties: {
            items: {
              type: 'array',
              items: { $ref: getSchemaPath(PriceModel) },
            },
          },
        },
      ],
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid pagination options' })
  getAll(
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
  @ApiParamSKU()
  @ApiOperation({
    summary: 'Get price of an item',
    description: 'Gets the price of an item. Fails if the item is not priced',
  })
  @ApiOkResponse({
    status: 200,
    type: PriceModel,
  })
  @ApiResponse({ status: 404, description: 'Item is not priced' })
  getBySKU(@Param('sku') sku: string): Promise<Price> {
    return this.priceService.getBySKU(sku);
  }

  @Post(':sku/refresh')
  @ApiParamSKU()
  @ApiOperation({
    summary: 'Requests an item to be priced',
    description:
      'Requests an item to be priced by adding it to the price check queue',
  })
  @ApiOkResponse({
    status: 200,
    type: CheckPriceModel,
  })
  @HttpCode(200)
  refresh(@Param('sku') sku: string): Promise<CheckPrice> {
    return this.priceService.checkBySKU(sku);
  }
}
