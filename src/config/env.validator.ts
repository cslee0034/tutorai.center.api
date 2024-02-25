import Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().required(),
  SERVER_NAME: Joi.string().required(),
  NAEYEOP_API_HOST: Joi.string().required(),
  NAEYEOP_API_PORT: Joi.number().required(),
  HTTP_TIMEOUT: Joi.number().required(),
  HTTP_MAX_REDIRECTS: Joi.number().required(),
  RDB_HOST: Joi.string().required(),
  RDB_PORT: Joi.number().required(),
  RDB_USERNAME: Joi.string().required(),
  RDB_PASSWORD: Joi.string().required(),
  RDB_DATABASE: Joi.string().required(),
  RDB_SYNCHRONIZE: Joi.boolean().required(),
  RDB_LOGGING: Joi.boolean().required(),
  RDB_URL: Joi.string().required(),
  CACHE_HOST: Joi.string().required(),
  CACHE_PORT: Joi.number().required(),
  CACHE_PASSWORD: Joi.string().required(),
  ENCRYPT_SALT: Joi.number().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
});
