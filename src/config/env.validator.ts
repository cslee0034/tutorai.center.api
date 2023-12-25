import Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().required(),
  CENTER_API_HOST: Joi.string().required(),
  CENTER_API_PORT: Joi.number().required(),
  HTTP_TIMEOUT: Joi.number().required(),
  HTTP_MAX_REDIRECTS: Joi.number().required(),
  RDB_HOST: Joi.string().required(),
  RDB_PORT: Joi.number().required(),
  RDB_USERNAME: Joi.string().required(),
  RDB_PASSWORD: Joi.string().required(),
  RDB_NAME: Joi.string().required(),
  RDB_SYNCHRONIZE: Joi.boolean().required(),
  RDB_LOGGING: Joi.boolean().required(),
  CACHE_PORT: Joi.number().required(),
  ENCRYPT_SALT: Joi.number().required(),
});
