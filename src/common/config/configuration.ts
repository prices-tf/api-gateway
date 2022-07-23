export interface Config {
  port: number;
  throttle: ThrottleConfig;
  redis: RedisConfig;
  cors: CorsConfig;
  services: Services;
}

export interface CorsConfig {
  origin: string;
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
  prices: string;
  jwk: string;
  history: string;
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
    cors: {
      origin: process.env.CORS_ORIGIN ?? 'https://prices.tf',
    },
    services: {
      prices: process.env.BPTF_PRICE_SERVICE_URL,
      jwk: process.env.JWK_SERVICE_URL,
      history: process.env.BPTF_PRICE_HISTORY_SERVICE_URL,
    },
  };
};
