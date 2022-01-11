import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsPositive, Min } from 'class-validator';
import { IsGreater } from '../../common/decorators/is-greater.decorator';
import { IsSmaller } from '../../common/decorators/is-smaller.decorator';

export class GetHistoryWithIntervalDto {
  @ApiProperty({
    description: 'Interval in milliseconds (minimum is 30 minutes)',
    default: 3600000,
    required: true,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1800000)
  @Type(() => Number)
  readonly interval: number;

  @ApiProperty({
    required: false,
    description: 'Timestamp to get prices from',
  })
  @IsOptional()
  @IsDate()
  @IsSmaller('to')
  @Type(() => Date)
  readonly from?: Date;

  @ApiProperty({
    required: false,
    description: 'Timestamp to get prices to',
  })
  @IsOptional()
  @IsDate()
  @IsGreater('from')
  @Type(() => Date)
  readonly to?: Date;
}
