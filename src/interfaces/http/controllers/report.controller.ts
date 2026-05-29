import { Request, Response, NextFunction } from 'express';
import { SavingsRepository, LoanRepository, KSPSettingsRepository } from '../../../domain/repositories';
import { DatabasePool } from '../../../infrastructure/database/connection';
import { Router } from 'express';
import { KSPSettings } from '../../../domain/entities';

export class ReportController {
  constructor(
    private savingsRepository: SavingsRepository,
    private loanRepository: LoanRepository,
    private kspSettingsRepository: KSPSettingsRepository,
    private pool: DatabasePool
  ) {}

  private async getKSPSettings(): Promise<KSPSettings | null> {
    return this.kspSettingsRepository.get();
  }

  getNeraca = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const kspSettings = await this.getKSPSettings();
      
      const savingsData = await this.pool.query('SELECT SUM(balance) as total FROM savings');
      
      const loanData = await this.pool.query('SELECT SUM(amount) as total_disbursed FROM loans WHERE status = $1', ['disbursed']);
      
      res.status(200).json({
        status: 'success',
        ksp: kspSettings,
        report: {
          title: 'Neraca',
          date: new Date().toISOString(),
          assets: {
            kas: savingsData.rows[0]?.total || 0,
            piutang_diberikan: loanData.rows[0]?.total_disbursed || 0,
            total_assets: Number(savingsData.rows[0]?.total || 0) + Number(loanData.rows[0]?.total_disbursed || 0)
          }
        }
      });
    } catch (error) {
      next(error);
    }
  };

  getPHU = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const kspSettings = await this.getKSPSettings();
      
      const savingsData = await this.pool.query('SELECT SUM(balance) as total FROM savings');
      
      res.status(200).json({
        status: 'success',
        ksp: kspSettings,
        report: {
          title: 'Laporan Perubahan Hak Milik Usaha (PHU)',
          date: new Date().toISOString(),
          shu: {
            total_savings: savingsData.rows[0]?.total || 0
          }
        }
      });
    } catch (error) {
      next(error);
    }
  };

  getArusKas = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const kspSettings = await this.getKSPSettings();
      
      const savingsData = await this.pool.query('SELECT SUM(balance) as total FROM savings');
      
      res.status(200).json({
        status: 'success',
        ksp: kspSettings,
        report: {
          title: 'Arus Kas',
          date: new Date().toISOString(),
          cashFlow: {
            kas_masuk: savingsData.rows[0]?.total || 0,
            kas_keluar: 0
          }
        }
      });
    } catch (error) {
      next(error);
    }
  };
}

export const createReportRouter = (reportController: ReportController) => {
  const router = Router();
  router.get('/neraca', reportController.getNeraca);
  router.get('/phu', reportController.getPHU);
  router.get('/arus-kas', reportController.getArusKas);
  return router;
};