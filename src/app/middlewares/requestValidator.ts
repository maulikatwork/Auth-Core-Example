import { Request, Response, NextFunction } from 'express';
import Joi, { Schema } from 'joi';
import { StatusCodes } from 'http-status-codes';

/**
 * Middleware to validate request data using Joi schemas
 * @param schema - Joi validation schema
 */
const requestValidator = (schema: Schema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const errorMessage = error.details.map((detail) => detail.message).join(', ');

        res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Validation Error',
          errors: errorMessage,
        });
        return;
      }

      // Replace req.body with validated data
      req.body = value;
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default requestValidator;
