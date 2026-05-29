import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../../../infrastructure/config/jwt';
import { UnauthorizedError, ForbiddenError } from '../../../shared/errors/app.error';

const jwtService = new JwtService();

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Access token required'));
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwtService.verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    return next(new UnauthorizedError('Invalid or expired token'));
  }
};

export const roleMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('User not authenticated'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }

    next();
  };
};