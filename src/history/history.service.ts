import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Paginated } from '../common/interfaces/paginated.interface';
import { Config, Services } from '../common/config/configuration';

@Injectable()
export class HistoryService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<Config>,
  ) {}

  paginate(
    sku: string,
    order: 'ASC' | 'DESC',
    page?: number,
    limit = 100,
    from?: Date,
  ): Promise<Paginated<History>> {
    const url = `${
      this.configService.get<Services>('services').history
    }/history/${sku}`;

    return this.httpService
      .get(url, {
        params: {
          page,
          limit,
          order,
          from,
        },
      })
      .toPromise()
      .then((response) => response.data);
  }
}
