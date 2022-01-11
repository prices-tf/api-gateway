import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Paginated } from '../common/interfaces/paginated.interface';
import { PaginatedModel } from '../common/models/paginated.model';
import { ApiParamSKU } from '../common/swagger/api-param-sku.decorator';
import { GetHistoryWithIntervalDto } from './dto/get-history-with-interval.dto';
import { GetHistoryDto } from './dto/get-history.dto';
import { HistoryService } from './history.service';
import { History } from './interfaces/history.interface';
import { HistoryModel } from './models/history.model';

@ApiTags('History')
@ApiBearerAuth('access-token')
@ApiExtraModels(PaginatedModel, HistoryModel)
@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get(':sku')
  @ApiParamSKU()
  @ApiOperation({
    summary: 'Paginate price history.',
    description:
      'Use page, limit and from to paginate price history of specified item',
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
              items: { $ref: getSchemaPath(HistoryModel) },
            },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid pagination or query options',
  })
  getHistory(
    @Query(
      new ValidationPipe({
        transform: true,
      }),
    )
    query: GetHistoryDto,
    @Param('sku') sku: string,
  ): Promise<Paginated<History>> {
    return this.historyService.paginate(
      sku,
      query.order,
      query.page,
      query.limit,
      query.from,
    );
  }

  @Get(':sku/interval')
  @ApiParamSKU()
  @ApiOperation({
    summary: 'Paginate price history using intervals',
    description:
      'Use interval, to and from to paginate price history of specified item and get price for each interval',
  })
  @ApiOkResponse({
    status: 200,
    schema: {
      properties: {
        items: {
          type: 'array',
          items: { $ref: getSchemaPath(HistoryModel) },
        },
      },
      example: [
        {
          sku: '5021;6',
          buyHalfScrap: 1186,
          buyKeys: 0,
          sellHalfScrap: 1188,
          sellKeys: 0,
          createdAt: '2022-01-07T00:00:00.000Z',
        },
        {
          sku: '5021;6',
          buyHalfScrap: 1172,
          buyKeys: 0,
          sellHalfScrap: 1174,
          sellKeys: 0,
          createdAt: '2022-01-08T00:00:00.000Z',
        },
        {
          sku: '5021;6',
          buyHalfScrap: 1176,
          buyKeys: 0,
          sellHalfScrap: 1178,
          sellKeys: 0,
          createdAt: '2022-01-09T00:00:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query options',
  })
  getIntervalHistory(
    @Query(
      new ValidationPipe({
        transform: true,
      }),
    )
    query: GetHistoryWithIntervalDto,
    @Param('sku') sku: string,
  ): Promise<History[]> {
    const maxIntervals = 200;

    let from: Date = null;
    let to: Date = null;

    if (query.from && query.to) {
      // Check if from and to are within range
      const fromInterval = Math.floor(query.from.getTime() / query.interval);
      const toInterval = Math.floor(query.to.getTime() / query.interval);

      if (Math.abs(fromInterval - toInterval) > maxIntervals) {
        throw new BadRequestException(
          'The resulting amount of intervals is limited to ' + maxIntervals,
        );
      }
    } else if (query.from) {
      from = query.from;
      to = new Date(from.getTime() + maxIntervals * query.interval);
    } else if (query.to) {
      to = query.to;
      from = new Date(to.getTime() + maxIntervals * query.interval);
    } else if (!query.from && !query.to) {
      to = new Date();
      from = new Date(to.getTime() - maxIntervals * query.interval);
    }

    return this.historyService.intervals(sku, query.interval, from, to);
  }
}
