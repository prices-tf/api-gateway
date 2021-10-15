import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive, Max } from 'class-validator';

enum OrderEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class GetPricesDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  readonly page: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(100)
  @Type(() => Number)
  readonly limit: number;

  @IsOptional()
  @IsEnum(OrderEnum)
  readonly order: OrderEnum;
}
