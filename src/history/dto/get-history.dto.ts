import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive, Max } from 'class-validator';

enum OrderEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class GetHistoryDto {
  @ApiProperty({
    description: 'Page to request',
    default: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  readonly page: number;

  @ApiProperty({
    description: 'Amount of prices',
    default: 100,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(100)
  @Type(() => Number)
  readonly limit: number;

  @ApiProperty({
    required: true,
    enum: OrderEnum,
    enumName: 'OrderEnum',
    description:
      'Ordering the prices depending on the time ascending or descending',
  })
  @IsEnum(OrderEnum)
  readonly order: OrderEnum;

  @ApiProperty({
    required: false,
    description:
      'Timestamp to get prices from. Use with ordering to get prices older than or newer than specified timestamp',
  })
  @IsOptional()
  @Type(() => Date)
  readonly from: Date;
}
