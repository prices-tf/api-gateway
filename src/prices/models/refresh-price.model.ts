import { ApiProperty } from '@nestjs/swagger';
import { Refresh } from '../../snapshots/interfaces/refresh.interface';

export class RefreshPriceModel implements Refresh {
  @ApiProperty({
    description:
      'If the price refresh request was added to the queue. Is false if it is already in the queue',
  })
  enqueued: boolean;
}
