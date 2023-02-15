import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { RedisOptions } from 'ioredis';
import { Config, RedisConfig } from '../common/config/configuration';

@Injectable()
export class ThrottlerService {
  private redisClient: Redis;

  constructor(private readonly configService: ConfigService<Config>) {
    const config = this.configService.get<RedisConfig>('redis');

    let redisConfig: RedisOptions;

    if (config.isSentinel) {
      redisConfig = {
        sentinels: [
          {
            host: config.host,
            port: config.port,
          },
        ],
        name: config.set,
      };
    } else {
      redisConfig = {
        host: config.host,
        port: config.port,
        password: config.password,
      };
    }

    this.redisClient = new Redis(redisConfig);
  }

  getRedis(): Redis {
    return this.redisClient;
  }

  async onModuleDestroy(): Promise<void> {
    await this.redisClient.quit();
  }
}
