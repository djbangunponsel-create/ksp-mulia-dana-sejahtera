import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../../../domain/repositories';
import { authMiddleware } from '../middleware/auth.middleware';
import { Router } from 'express';

export class ProfileController {
  constructor(private userRepository: UserRepository) {}

  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }

      const user = await this.userRepository.findById(req.user.id);
      if (!user) {
        res.status(404).json({ status: 'error', message: 'User not found' });
        return;
      }

const userWithoutPassword = Object.fromEntries(
      Object.entries(user).filter(([key]) => key !== 'password')
    );

    res.status(200).json({
      status: 'success',
      data: userWithoutPassword,
    });
    } catch (error) {
      next(error);
    }
  };
}

export const createProfileRouter = (profileController: ProfileController) => {
  const router = Router();
  router.get('/', authMiddleware, profileController.getProfile);
  return router;
};