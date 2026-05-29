import { Request, Response, NextFunction } from 'express';
import { SavingsRepository, LoanRepository, KSPSettingsRepository } from '../../../domain/repositories';
import { DatabasePool } from '../../../infrastructure/database/connection';
export declare class ReportController {
    private savingsRepository;
    private loanRepository;
    private kspSettingsRepository;
    private pool;
    constructor(savingsRepository: SavingsRepository, loanRepository: LoanRepository, kspSettingsRepository: KSPSettingsRepository, pool: DatabasePool);
    private getKSPSettings;
    getNeraca: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getPHU: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getArusKas: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export declare const createReportRouter: (reportController: ReportController) => any;
