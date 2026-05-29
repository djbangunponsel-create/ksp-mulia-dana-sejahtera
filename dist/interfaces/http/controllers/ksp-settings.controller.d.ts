import { Request, Response, NextFunction } from 'express';
import { KSPSettingsRepository } from '../../../domain/repositories';
export declare class KSPSettingsController {
    private kspSettingsRepository;
    constructor(kspSettingsRepository: KSPSettingsRepository);
    getSettings: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateSettings: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export declare const createKSPSettingsRouter: (kspSettingsController: KSPSettingsController) => any;
