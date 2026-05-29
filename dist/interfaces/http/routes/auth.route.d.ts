import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
export declare const createAuthRouter: (authController: AuthController) => Router;
