import { ApiProperty } from '@nestjs/swagger';
import { Paginated } from '../interfaces/paginated.interface';

export class PaginatedMetadataModel {
  @ApiProperty({
    description: 'Total items available for query',
    example: 1234,
    type: 'integer',
  })
  totalItems: number;

  @ApiProperty({
    description: 'Amount of items in current page',
    example: 1234,
    type: 'integer',
  })
  itemCount: number;

  @ApiProperty({
    description: 'Amount of items per page',
    example: 100,
    type: 'integer',
  })
  itemsPerPage: number;

  @ApiProperty({
    description: 'Total amount of pages with current page size',
    example: 20,
    type: 'integer',
  })
  totalPages: number;

  @ApiProperty({
    description: 'The current page',
    example: 1,
    type: 'integer',
  })
  currentPage: number;
}

export class PaginatedModel<T> implements Paginated<T> {
  @ApiProperty({
    description: 'List of items',
    isArray: true,
  })
  items: T[];

  @ApiProperty({
    description: 'Pagination metadata',
  })
  meta: PaginatedMetadataModel;
}
