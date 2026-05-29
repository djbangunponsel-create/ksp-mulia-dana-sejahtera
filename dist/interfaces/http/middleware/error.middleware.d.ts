import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../shared/errors/app.error';
export declare const errorHandler: (error: Error, req: Request, res: Response, _next: NextFunction) => Response;
export declare const notFoundHandler: (req: Request, res: Response) => Response;
export type { AppError };
