import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../shared/errors/app.error';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  const statusCode = error instanceof AppError ? error.statusCode : 500;
  
  if (error instanceof AppError) {
    return res.status(statusCode).json({
      status: 'error',
      statusCode,
      message: error.message,
    });
  }

  console.error('Unexpected error:', error);

  return res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: 'Internal server error',
  });
};

export const notFoundHandler = (req: Request, res: Response): Response => {
  return res.status(404).json({
    status: 'error',
    statusCode: 404,
    message: 'Route not found',
  });
};

export type { AppError };