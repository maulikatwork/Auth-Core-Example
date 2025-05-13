import express, { Application } from 'express';
import { corsOptions } from './config/cors.config';
import { helmetConfig } from './config/helmet.config';
import { requestLogger, fileLogger, errorLogger } from './config/logger';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import CustomError from './app/errors';
import { applyRateLimit } from './config/rateLimit.config';
import rootDesign from './app/middlewares/rootDesign';
import healthCheckUI from './app/middlewares/healthCheckUI';
import routers from './app/routers';
import cookieParser from 'cookie-parser';

const app: Application = express();

// Trust proxy - needed for express-rate-limit behind proxies
app.set('trust proxy', 1);

//Global Middlewares
app.use(helmetConfig);
app.use(corsOptions);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Apply rate limiting middleware
app.use(applyRateLimit());

// Add logging middleware
app.use(requestLogger); // Console logging
app.use(fileLogger); // File logging

//Application Middlewares
app.use('/', routers);

app.get('/', rootDesign);
app.get('/health', healthCheckUI);

app.get('/error', (req, res, next) => {
  next(new CustomError.BadRequestError('Testin error'));
});

app.get('/favicon.ico', (_req, res) => {
  res.status(204).end();
});

// Error logging middleware (should be after routes)
app.use(errorLogger);
app.use(globalErrorHandler);
app.use(notFound);

export default app;
