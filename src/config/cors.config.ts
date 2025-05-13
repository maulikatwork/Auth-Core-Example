import cors, { CorsOptions, CorsRequest } from 'cors';
import config from './index';

// Get origins from environment configuration
const whitelist = config.cors.allowedOrigins;
const adminOrigins = config.cors.adminOrigins;

// Log CORS mode on startup
if (config.server.env === 'development') {
  console.log('🔓 CORS: Running in development mode - All origins allowed');
} else {
  console.log(`🔒 CORS: Running in ${config.server.env} mode - Restricted to whitelisted origins`);
  console.log(`Allowed origins: ${whitelist.join(', ')}`);
  console.log(`Admin origins: ${adminOrigins.join(', ')}`);
}

// Base CORS configuration factory
const createCorsOptionsDelegate = (allowedOrigins: string[], errorMessage: string) => {
  return (requestOrigin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (config.server.env === 'development') {
      callback(null, true);
      return;
    }

    if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
      callback(null, true);
    } else {
      callback(new Error(errorMessage));
    }
  };
};

// Base CORS options factory
const createCorsOptions = (
  options: Partial<CorsOptions> & {
    origins: string[];
    errorMessage: string;
  },
): CorsOptions => {
  const { origins, errorMessage, ...restOptions } = options;

  return {
    origin: createCorsOptionsDelegate(origins, errorMessage),
    credentials: true,
    ...restOptions,
  };
};

// Export specific CORS configurations
export const corsOptions = cors(
  createCorsOptions({
    origins: whitelist,
    errorMessage: 'Not allowed by CORS',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    maxAge: 86400, // 24 hours
  }),
);

export const authCorsOptions = cors(
  createCorsOptions({
    origins: whitelist,
    errorMessage: 'Not allowed by CORS for auth endpoints',
    methods: ['POST', 'GET'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 300, // 5 minutes
  }),
);
