import { Request, Response, NextFunction } from "express";

// Define the allowed role types
type Role = 'admin' | 'field_agent' | 'medical' | 'trainer';

// Extend Express Request to include a typed `user` object
interface AuthenticatedRequest extends Request {
  user?: {
    role: Role
  };
}

// Middleware
export const checkRole = (...roles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(401).json({
        message: `Access denied: Requires one of [${roles.join(", ")}]`,
      });
    }

    next();
  };
};
