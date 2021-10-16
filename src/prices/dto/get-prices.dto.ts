import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive, Max } from 'class-validator';

enum OrderEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class GetPricesDto {
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
    required: false,
    enum: OrderEnum,
    enumName: 'OrderEnum',
  })
  @IsOptional()
  @IsEnum(OrderEnum)
  readonly order: OrderEnum;
}
