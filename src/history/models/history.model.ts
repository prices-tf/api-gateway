import { ApiProperty } from '@nestjs/swagger';
import { History } from '../interfaces/history.interface';

export class HistoryModel implements History {
  @ApiProperty({
    example: '5021;6',
  })
  sku: string;

  @ApiProperty({
    example: 1008,
    type: 'integer',
    description: 'Buy price half scrap, 1008 half scrap is 56 ref',
  })
  buyHalfScrap: number;

  @ApiProperty({
    example: 0,
    description: 'Buy price keys',
    type: 'integer',
  })
  buyKeys: number;

  @ApiProperty({
    example: 1010,
    type: 'integer',
    description: 'Sell price half scrap, 1010 half scrap is 56.11 ref',
  })
  sellHalfScrap: number;

  @ApiProperty({
    example: 0,
    description: 'Sell price keys',
    type: 'integer',
  })
  sellKeys: number;

  @ApiProperty({
    example: '2021-10-11T23:05:32.696Z',
    description: 'Timestamp for when price was made',
    type: 'string',
    format: 'date-time',
  })
  createdAt: string;
}
