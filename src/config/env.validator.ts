import Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().required(),
  CENTER_API_HOST: Joi.string().required(),
  CENTER_API_PORT: Joi.number().required(),
});
