import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { Config, RedisConfig } from '../common/config/configuration';

@Injectable()
export class ThrottlerService implements OnModuleDestroy {
  private redisClient: Redis.Redis;

  constructor(private readonly configService: ConfigService<Config>) {
    const config = configService.get<RedisConfig>('redis');

    let redisConfig: Redis.RedisOptions;

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

  getRedis(): Redis.Redis {
    return this.redisClient;
  }

  async onModuleDestroy(): Promise<void> {
    await this.redisClient.quit();
  }
}
