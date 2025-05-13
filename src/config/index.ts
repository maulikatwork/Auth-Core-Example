import Joi from 'joi';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Define validation schema
const envVarsSchema = Joi.object()
  .keys({
    // Server Configuration
    PORT: Joi.number().default(5003),
    SERVER_NAME: Joi.string().required(),
    NODE_ENV: Joi.string().valid('production', 'development', 'test').default('development'),

    // MongoDB Configuration
    MONGODB_URL: Joi.string().required().description('MongoDB Connection URL'),

    // JWT Configuration
    JWT_ACCESS_TOKEN_SECRET: Joi.string().required().min(32),
    JWT_ACCESS_TOKEN_EXPIRESIN: Joi.string().default('7d'),
    JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
    JWT_REFRESH_TOKEN_EXPIRESIN: Joi.string().default('30d'),

    // CORS Configuration
    CORS_ALLOWED_ORIGINS: Joi.string().required(),
    CORS_ADMIN_ORIGINS: Joi.string().required(),
  })
  .unknown();

// Validate environment variables
const { value: envVars, error } = envVarsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// Parse CORS origins from comma-separated strings to arrays
const corsAllowedOrigins = envVars.CORS_ALLOWED_ORIGINS.split(',');
const corsAdminOrigins = envVars.CORS_ADMIN_ORIGINS.split(',');

// Create config object
const config = {
  server: {
    port: envVars.PORT,
    name: envVars.SERVER_NAME,
    env: envVars.NODE_ENV,
  },

  mongodb: {
    url: envVars.MONGODB_URL,
  },

  jwt: {
    accessToken: {
      secret: envVars.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: envVars.JWT_ACCESS_TOKEN_EXPIRESIN,
    },
    refreshToken: {
      secret: envVars.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: envVars.JWT_REFRESH_TOKEN_EXPIRESIN,
    },
  },

  cors: {
    allowedOrigins: corsAllowedOrigins,
    adminOrigins: corsAdminOrigins,
  },
};

export default config;
