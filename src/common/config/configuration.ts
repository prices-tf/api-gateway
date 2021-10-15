export interface Config {
  port: number;
  throttle: ThrottleConfig;
  services: Services;
}

export interface ThrottleConfig {
  ttl: number;
  limit: number;
}

export interface Services {
  snapshots: string;
  prices: string;
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
    services: {
      snapshots: process.env.BPTF_SNAPSHOT_SERVICE_URL,
      prices: process.env.BPTF_PRICE_SERVICE_URL,
    },
  };
};
