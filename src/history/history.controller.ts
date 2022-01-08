import { Controller, Get, Param, Query, ValidationPipe } from '@nestjs/common';
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
import { GetHistoryDto } from './dto/get-history.dto';
import { HistoryService } from './history.service';
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
  getAll(
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
}
