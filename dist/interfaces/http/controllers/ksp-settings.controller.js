"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createKSPSettingsRouter = exports.KSPSettingsController = void 0;
const express_1 = require("express");
class KSPSettingsController {
    kspSettingsRepository;
    constructor(kspSettingsRepository) {
        this.kspSettingsRepository = kspSettingsRepository;
    }
    getSettings = async (req, res, next) => {
        try {
            const settings = await this.kspSettingsRepository.get();
            res.status(200).json({
                status: 'success',
                data: settings,
            });
        }
        catch (error) {
            next(error);
        }
    };
    updateSettings = async (req, res, next) => {
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
        }
        catch (error) {
            next(error);
        }
    };
}
exports.KSPSettingsController = KSPSettingsController;
const createKSPSettingsRouter = (kspSettingsController) => {
    const router = (0, express_1.Router)();
    router.get('/', kspSettingsController.getSettings);
    router.post('/', kspSettingsController.updateSettings);
    return router;
};
exports.createKSPSettingsRouter = createKSPSettingsRouter;
//# sourceMappingURL=ksp-settings.controller.js.map