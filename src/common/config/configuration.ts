export interface Config {
  port: number;
  throttle: ThrottleConfig;
  redis: RedisConfig;
  services: Services;
}

export interface ThrottleConfig {
  ttl: number;
  limit: number;
}

export interface RedisConfig {
  isSentinel: boolean;
  host: string;
  port: number;
  password?: string;
  set?: string;
}

export interface Services {
  snapshots: string;
  prices: string;
  jwk: string;
}

export default (): Config => {
  return {
    port:
      process.env.NODE_ENV === 'production'
        ? 3000
        : parseInt(process.env.PORT, 10),
    throttle: {
      ttl: parseInt(process.env.THROTTLE_TTL, 10),
      limit: parseInt(process.env.THROTTLE_LIMIT, 10),
    },
    redis: {
      isSentinel: process.env.REDIS_IS_SENTINEL === 'true',
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 10),
      password: process.env.REDIS_PASSWORD,
      set: process.env.REDIS_SET,
    },
    services: {
      snapshots: process.env.BPTF_SNAPSHOT_SERVICE_URL,
      prices: process.env.BPTF_PRICE_SERVICE_URL,
      jwk: process.env.JWK_SERVICE_URL,
    },
  };
};
