import { Request, Response, NextFunction } from 'express';
import { AuthUseCase } from '../../../application/usecases/auth.usecase';
export declare class AuthController {
    private authUseCase;
    constructor(authUseCase: AuthUseCase);
    register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
