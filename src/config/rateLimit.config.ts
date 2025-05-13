import rateLimit from 'express-rate-limit';
import { Request } from 'express';
import logger from './logger';
import config from './index';

type HitCountData = {
  count: number;
  firstHit: Date;
  lastHit: Date;
  pathCounts: Record<string, number>;
};

const hitCounts: Record<string, HitCountData> = {};

// Default trusted IPs (local development and internal networks)
const trustedIPs = ['127.0.0.1', '::1', '::ffff:127.0.0.1', 'localhost'];

// Define different rate limits based on environment
const getRateLimitOptions = () => {
  const isProd = config.server.env === 'production';

  return {
    windowMs: isProd ? 5 * 60 * 1000 : 5 * 60 * 1000, // 5 minutes in both environments
    limit: isProd ? 100 : 500, // Stricter limit in production
    standardHeaders: 'draft-7',
    legacyHeaders: false,
  };
};

export const applyRateLimit = () => {
  const options = getRateLimitOptions();

  return rateLimit({
    windowMs: options.windowMs,
    limit: options.limit,
    standardHeaders: options.standardHeaders,
    legacyHeaders: options.legacyHeaders,
    message: {
      statusCode: 429,
      error: 'Too Many Requests',
      message: 'You have exceeded the allowed number of requests. Please try again later.',
    },
    skip: (req: Request) => {
      const rawIP = req.ip ?? '';
      const ip = rawIP.replace('::ffff:', ''); // Normalize IPv4 from IPv6 format

      // Skip rate limiting for trusted IPs
      return trustedIPs.includes(ip) || trustedIPs.includes(rawIP);
    },
    keyGenerator: (req: Request) => {
      const rawIP = req.ip ?? ''; // fallback if undefined
      const ip = rawIP.replace('::ffff:', ''); // Normalize IPv4 from IPv6 format
      const path = req.path;
      const now = new Date();

      if (!hitCounts[ip]) {
        hitCounts[ip] = {
          count: 1,
          firstHit: now,
          lastHit: now,
          pathCounts: { [path]: 1 },
        };
      } else {
        hitCounts[ip]!.count++;
        hitCounts[ip]!.lastHit = now;
        hitCounts[ip]!.pathCounts[path] = (hitCounts[ip]!.pathCounts[path] || 0) + 1;
      }

      const ipData = hitCounts[ip]!;

      // Only log rate limit information in development to reduce noise
      if (config.server.env === 'development') {
        const log = [
          `[RateLimit]`,
          `IP: ${ip}`,
          `Total: ${ipData.count}`,
          `First: ${ipData.firstHit.toLocaleString()}`,
          `Last: ${ipData.lastHit.toLocaleTimeString()}`,
          `Path: ${path}`,
          `Hits on path: ${ipData.pathCounts[path]}`,
        ].join(' | ');

        console.log(log);
      }

      return ip;
    },

    // log in file (too many requests)
    handler: (req, res, next, options) => {
      const rawIP = req.ip ?? '';
      const ip = rawIP.replace('::ffff:', '');
      const path = req.path;
      const method = req.method;

      logger.warn(`[RateLimit] Too many requests (${options.limit}) from ${ip} on ${method} ${path}`);

      res.status(options.statusCode).json(options.message);
    },
  });
};
