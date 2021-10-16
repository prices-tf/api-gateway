import { ApiProperty } from '@nestjs/swagger';
import { Price } from '../interfaces/price.interface';

export class PriceModel implements Price {
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
    example: null,
    description: 'The buy price for keys used to make the price',
    type: 'integer',
    nullable: true,
  })
  buyKeyHalfScrap: number;

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
    example: null,
    description: 'The sell price for keys used to make the price',
    type: 'integer',
    nullable: true,
  })
  sellKeyHalfScrap: number;

  @ApiProperty({
    example: '2021-10-11T23:05:32.696Z',
    description: 'Timestamp for when item was first priced',
    type: 'string',
    format: 'date-time',
  })
  createdAt: string;

  @ApiProperty({
    example: '2021-10-15T23:29:33.086Z',
    description: 'Timestamp for when price was last updated',
    type: 'string',
    format: 'date-time',
  })
  updatedAt: string;
}
