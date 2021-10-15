export interface Config {
  port: number;
  services: Services;
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
    services: {
      snapshots: process.env.BPTF_SNAPSHOT_SERVICE_URL,
      prices: process.env.BPTF_PRICE_SERVICE_URL,
    },
  };
};
