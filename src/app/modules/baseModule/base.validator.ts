import Joi from 'joi';

/**
 * Base validation schema for creating a resource
 */
export const createBaseSchema = Joi.object({
  name: Joi.string().required().min(2).messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters',
    'any.required': 'Name is required',
  }),

  description: Joi.string().optional(),
});

/**
 * Base validation schema for updating a resource
 */
export const updateBaseSchema = Joi.object({
  name: Joi.string().min(2).messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name must be at least 2 characters',
  }),

  description: Joi.string().optional(),
});

/**
 * Base validator type for creating a resource
 */
export interface CreateBaseInput {
  name: string;
  description?: string;
}

/**
 * Base validator type for updating a resource
 */
export interface UpdateBaseInput {
  name?: string;
  description?: string;
}
