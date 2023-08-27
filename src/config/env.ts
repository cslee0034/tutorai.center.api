import Joi from 'joi';

const env = () => ({
  app: {
    host: process.env.CENTER_API_HOST || 'localhost',
    port: +process.env.CENTER_API_PORT || 4000,
  },
});

const validationSchema = Joi.object({
  CENTER_API_HOST: Joi.string().required(),
  CENTER_API_PORT: Joi.number().required(),
});

export { env, validationSchema };
