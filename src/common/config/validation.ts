import Joi from 'joi';

const validation = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  PORT: Joi.number().default(3000),
  THROTTLE_TTL: Joi.number().integer().positive().required(),
  THROTTLE_LIMIT: Joi.number().integer().positive().required(),
  REDIS_IS_SENTINEL: Joi.boolean().optional(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  REDIS_PASSWORD: Joi.string().optional(),
  REDIS_SET: Joi.string().optional(),
  // Only allow CORS_ORIGIN when not in production
  CORS_ORIGIN: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.forbidden(),
    otherwise: Joi.required(),
  }),
  BPTF_PRICE_SERVICE_URL: Joi.string().required(),
  JWK_SERVICE_URL: Joi.string().required(),
  BPTF_PRICE_HISTORY_SERVICE_URL: Joi.string().required(),
});

export { validation };
