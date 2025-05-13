import winston from 'winston';
import morgan from 'morgan';
import { Request, Response, NextFunction } from 'express';
import colors from 'colors';
import path from 'path';
import fs from 'fs';

// Ensure logs directory exists
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Define log formats
const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

// Create Winston logger
const logger = winston.createLogger({
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
  transports: [
    // Console transport
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    }),
    // File transport for general logs
    new winston.transports.File({
      filename: path.join(logDir, 'app.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Separate file transport for errors
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// Custom token for response time in different colors
morgan.token('response-time-colored', (req: Request, res: Response) => {
  const time = res.getHeader('X-Response-Time');
  const numTime = typeof time === 'string' ? parseFloat(time) : Number(time) || 0;

  if (numTime < 100) return colors.green(`${numTime}ms`);
  if (numTime < 500) return colors.yellow(`${numTime}ms`);
  return colors.red(`${numTime}ms`);
});

// Custom token for method with colors
morgan.token('method-colored', (req: Request) => {
  const method = req.method.toUpperCase();
  switch (method) {
    case 'GET':
      return colors.green(method);
    case 'POST':
      return colors.yellow(method);
    case 'PUT':
      return colors.blue(method);
    case 'DELETE':
      return colors.red(method);
    default:
      return colors.white(method);
  }
});

// Create a write stream for Morgan
const accessLogStream = fs.createWriteStream(path.join(logDir, 'access.log'), { flags: 'a' });

// Morgan format string
const morganFormat = ':method-colored :url :status from :remote-addr - :response-time-colored';

// Middleware for HTTP request logging
export const requestLogger = morgan(morganFormat, {
  stream: {
    write: (message: string) => {
      logger.info(message.trim());
    },
  },
});

// Middleware for logging to file
export const fileLogger = morgan(morganFormat, {
  stream: accessLogStream,
});

// Error logging middleware
export const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`${err.name}: ${err.message}\nStack: ${err.stack}`);
  next(err);
};

export default logger;
