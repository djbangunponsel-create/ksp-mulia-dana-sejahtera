import { Request, Response, NextFunction } from 'express';
import { AuthUseCase } from '../../../application/usecases/auth.usecase';

export class AuthController {
  constructor(private authUseCase: AuthUseCase) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { nama, email, password, role } = req.body;
      const result = await this.authUseCase.register({ nama, email, password, role });

      res.status(201).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await this.authUseCase.login({ email, password });

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}