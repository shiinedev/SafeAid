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
