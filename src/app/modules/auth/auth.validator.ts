import Joi from 'joi';

// Phone OTP request validation schema
export const phoneOtpRequestSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^\+?[1-9]\d{9,14}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be a valid international format',
      'any.required': 'Phone number is required',
    }),
});

// OTP verification validation schema
export const otpVerificationSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^\+?[1-9]\d{9,14}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be a valid international format',
      'any.required': 'Phone number is required',
    }),
  otp: Joi.string().length(6).pattern(/^\d+$/).required().messages({
    'string.length': 'OTP must be 6 digits',
    'string.pattern.base': 'OTP must contain only numbers',
    'any.required': 'OTP is required',
  }),
});
