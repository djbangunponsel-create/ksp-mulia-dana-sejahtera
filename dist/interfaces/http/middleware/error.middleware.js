"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const app_error_1 = require("../../../shared/errors/app.error");
const errorHandler = (error, req, res, _next) => {
    const statusCode = error instanceof app_error_1.AppError ? error.statusCode : 500;
    if (error instanceof app_error_1.AppError) {
        return res.status(statusCode).json({
            status: 'error',
            statusCode,
            message: error.message,
        });
    }
    console.error('Unexpected error:', error);
    return res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: 'Internal server error',
    });
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res) => {
    return res.status(404).json({
        status: 'error',
        statusCode: 404,
        message: 'Route not found',
    });
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=error.middleware.js.map