// --- src/middlewares/verifyToken.ts ---
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET!);
    (req as any).userId = (decoded as any).id;
    (req as any).role = (decoded as any).role;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
