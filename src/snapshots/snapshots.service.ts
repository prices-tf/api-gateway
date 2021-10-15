import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config, Services } from '../common/config/configuration';
import { Refresh } from './interfaces/refresh.interface';

@Injectable()
export class SnapshotsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<Config>,
  ) {}

  refresh(sku: string): Promise<Refresh> {
    const url = `${
      this.configService.get<Services>('services').snapshots
    }/listings/${sku}/refresh`;

    return this.httpService
      .post(url, {
        priority: Number.MAX_SAFE_INTEGER,
        replace: false,
      })
      .toPromise()
      .then((response) => response.data);
  }
}
