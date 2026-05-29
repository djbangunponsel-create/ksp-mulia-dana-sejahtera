import { Request, Response, NextFunction } from 'express';
import { KSPSettingsRepository } from '../../../domain/repositories';
import { Router } from 'express';

export class KSPSettingsController {
  constructor(private kspSettingsRepository: KSPSettingsRepository) {}

  getSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const settings = await this.kspSettingsRepository.get();
      res.status(200).json({
        status: 'success',
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  };

  updateSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { nama, badan_hukum, alamat, email, telepon } = req.body;

      if (!nama || !badan_hukum || !alamat || !email || !telepon) {
        res.status(400).json({
          status: 'error',
          message: 'All fields are required: nama, badan_hukum, alamat, email, telepon',
        });
        return;
      }

      const settings = await this.kspSettingsRepository.update({
        nama,
        badan_hukum,
        alamat,
        email,
        telepon,
      });

      res.status(200).json({
        status: 'success',
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const createKSPSettingsRouter = (kspSettingsController: KSPSettingsController) => {
  const router = Router();
  router.get('/', kspSettingsController.getSettings);
  router.post('/', kspSettingsController.updateSettings);
  return router;
};