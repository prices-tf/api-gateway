import * as Joi from 'joi';

const validation = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  PORT: Joi.number().default(3000),
  THROTTLE_TTL: Joi.number().integer().positive().required(),
  THROTTLE_LIMIT: Joi.number().integer().positive().required(),
  BPTF_SNAPSHOT_SERVICE_URL: Joi.string().required(),
  BPTF_PRICE_SERVICE_URL: Joi.string().required(),
});

export { validation };
