import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  STAGE: Joi.string().required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.string().default(5432).required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PWD: Joi.string().required(),
});
