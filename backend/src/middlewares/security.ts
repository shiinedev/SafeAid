import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { Express } from 'express';

export function applySecurityMiddleware(app: Express) {
  // 1. Set secure HTTP headers
  app.use(helmet());

 
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));

  //   rate limiter
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max requests per IP
    message: 'Too many requests, please try again later.'
  });

  app.use(limiter);
}

export const loginRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // 3 attempts
  message: {
    status: 429,
    error: 'Too many login attempts. Please try again after 5 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
