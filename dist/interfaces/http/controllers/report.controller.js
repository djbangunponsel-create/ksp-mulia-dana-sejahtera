"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReportRouter = exports.ReportController = void 0;
const express_1 = require("express");
class ReportController {
    savingsRepository;
    loanRepository;
    kspSettingsRepository;
    pool;
    constructor(savingsRepository, loanRepository, kspSettingsRepository, pool) {
        this.savingsRepository = savingsRepository;
        this.loanRepository = loanRepository;
        this.kspSettingsRepository = kspSettingsRepository;
        this.pool = pool;
    }
    async getKSPSettings() {
        return this.kspSettingsRepository.get();
    }
    getNeraca = async (req, res, next) => {
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
        }
        catch (error) {
            next(error);
        }
    };
    getPHU = async (req, res, next) => {
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
        }
        catch (error) {
            next(error);
        }
    };
    getArusKas = async (req, res, next) => {
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
        }
        catch (error) {
            next(error);
        }
    };
}
exports.ReportController = ReportController;
const createReportRouter = (reportController) => {
    const router = (0, express_1.Router)();
    router.get('/neraca', reportController.getNeraca);
    router.get('/phu', reportController.getPHU);
    router.get('/arus-kas', reportController.getArusKas);
    return router;
};
exports.createReportRouter = createReportRouter;
//# sourceMappingURL=report.controller.js.map