"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProfileRouter = exports.ProfileController = void 0;
const auth_middleware_1 = require("../middleware/auth.middleware");
const express_1 = require("express");
class ProfileController {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    getProfile = async (req, res, next) => {
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
            const userWithoutPassword = Object.fromEntries(Object.entries(user).filter(([key]) => key !== 'password'));
            res.status(200).json({
                status: 'success',
                data: userWithoutPassword,
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.ProfileController = ProfileController;
const createProfileRouter = (profileController) => {
    const router = (0, express_1.Router)();
    router.get('/', auth_middleware_1.authMiddleware, profileController.getProfile);
    return router;
};
exports.createProfileRouter = createProfileRouter;
//# sourceMappingURL=profile.controller.js.map