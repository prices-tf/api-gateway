import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Paginated } from '../common/interfaces/paginated.interface';
import { Config, Services } from '../common/config/configuration';
import { Price } from './interfaces/price.interface';
import { CheckPrice } from './interfaces/check-price.interface';
import SKU from 'tf2-sku';

@Injectable()
export class PricesService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<Config>,
  ) {}

  getAll(
    page?: number,
    limit = 100,
    order?: 'ASC' | 'DESC',
    orderBy?: 'createdAt' | 'updatedAt',
  ): Promise<Paginated<Price>> {
    const url = `${this.configService.get<Services>('services').prices}/prices`;

    return this.httpService
      .get(url, {
        params: {
          page,
          limit,
          order,
          orderBy,
        },
      })
      .toPromise()
      .then((response) => response.data);
  }

  getBySKU(sku: string): Promise<Price> {
    const url = `${
      this.configService.get<Services>('services').prices
    }/prices/sku/${sku}`;

    return this.httpService
      .get(url)
      .toPromise()
      .then((response) => response.data)
      .catch((err) => {
        if (err.isAxiosError) {
          if (err.response?.data.message === 'This item is not priced') {
            throw new NotFoundException('This item is not priced');
          }
        }

        throw err;
      });
  }

  async checkBySKU(sku: string): Promise<CheckPrice> {
    if (sku !== SKU.fromObject(SKU.fromString(sku))) {
      throw new BadRequestException('Invalid SKU');
    }

    const url = `${
      this.configService.get<Services>('services').prices
    }/prices/sku/${sku}/check`;

    const result = await this.httpService
      .post(url)
      .toPromise()
      .then((response) => response.data);

    return {
      enqueued: result.enqueued,
      state: result.state,
    };
  }
}
