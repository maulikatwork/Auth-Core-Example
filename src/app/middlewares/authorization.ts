import { NextFunction, Request, Response } from 'express';
import { authMiddleware as authCoreMiddleware } from 'auth-core';

// Add user property to the Request interface
declare global {
  namespace Express {
    interface Request {
      user?: any;
      role?: string;
    }
  }
}

// Role-based authentication middleware
const authentication = (...requiredRoles: string[]) => {
  return [
    // Use auth-core middleware to attach user
    ...authCoreMiddleware({ include: ['user', 'role'] }),

    // Add role-based access control
    (req: Request, res: Response, next: NextFunction) => {
      try {
        // If no roles required, just continue
        if (!requiredRoles.length) {
          return next();
        }

        // Check if user has one of the required roles
        if (!req.role || !requiredRoles.includes(req.role)) {
          return res.status(403).json({
            success: false,
            message: 'Forbidden: Insufficient permissions',
          });
        }

        next();
      } catch (error) {
        next(error);
      }
    },
  ];
};

export default authentication;
