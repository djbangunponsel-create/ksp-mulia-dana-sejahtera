import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../../../domain/repositories';
export declare class ProfileController {
    private userRepository;
    constructor(userRepository: UserRepository);
    getProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export declare const createProfileRouter: (profileController: ProfileController) => import("express-serve-static-core").Router;
