import { ApiProperty } from '@nestjs/swagger';
import { CheckPrice } from '../interfaces/check-price.interface';

export class CheckPriceModel implements CheckPrice {
  @ApiProperty({
    description:
      'True if the price check was added to the queue. False if it is already in the queue',
  })
  enqueued: boolean;

  @ApiProperty({
    description: 'State of job in queue',
  })
  state: string;
}
