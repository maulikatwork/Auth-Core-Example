import helmet from 'helmet';
import config from './index';

const isProduction = process.env.NODE_ENV === 'production';
const FRONTEND_URLS = config.cors.allowedOrigins;

export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      scriptSrc: isProduction ? ["'self'", ...FRONTEND_URLS] : ["'self'", "'unsafe-inline'", "'unsafe-eval'", ...FRONTEND_URLS],
      styleSrc: isProduction
        ? ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com', ...FRONTEND_URLS]
        : ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com', ...FRONTEND_URLS],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
      connectSrc: ["'self'", ...FRONTEND_URLS],
      imgSrc: ["'self'", ...FRONTEND_URLS, 'data:', 'blob:'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'"],
      workerSrc: ["'self'", 'blob:'],
      childSrc: ["'self'", 'blob:'],
      formAction: ["'self'"],
      upgradeInsecureRequests: isProduction ? [] : null,
    },
  },
  crossOriginEmbedderPolicy: isProduction,
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  crossOriginResourcePolicy: { policy: 'same-origin' },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' },
  hsts: {
    maxAge: 31536000, // 1 year in seconds
    includeSubDomains: true,
    preload: true,
  },
  hidePoweredBy: true,
  ieNoOpen: true,
  noSniff: true,
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
});
