"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = exports.authMiddleware = void 0;
const jwt_1 = require("../../../infrastructure/config/jwt");
const app_error_1 = require("../../../shared/errors/app.error");
const jwtService = new jwt_1.JwtService();
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new app_error_1.UnauthorizedError('Access token required'));
    }
    const token = authHeader.substring(7);
    try {
        const decoded = jwtService.verifyToken(token);
        req.user = decoded;
        next();
    }
    catch {
        return next(new app_error_1.UnauthorizedError('Invalid or expired token'));
    }
};
exports.authMiddleware = authMiddleware;
const roleMiddleware = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new app_error_1.UnauthorizedError('User not authenticated'));
        }
        if (!roles.includes(req.user.role)) {
            return next(new app_error_1.ForbiddenError('Insufficient permissions'));
        }
        next();
    };
};
exports.roleMiddleware = roleMiddleware;
//# sourceMappingURL=auth.middleware.js.map