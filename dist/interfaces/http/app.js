"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = require("dotenv");
const connection_1 = require("../../infrastructure/database/connection");
const postgres_user_repository_1 = require("../../infrastructure/repositories/postgres-user.repository");
const postgres_member_repository_1 = require("../../infrastructure/repositories/postgres-member.repository");
const postgres_savings_repository_1 = require("../../infrastructure/repositories/postgres-savings.repository");
const postgres_loan_repository_1 = require("../../infrastructure/repositories/postgres-loan.repository");
const postgres_ksp_settings_repository_1 = require("../../infrastructure/repositories/postgres-ksp-settings.repository");
const jwt_1 = require("../../infrastructure/config/jwt");
const auth_usecase_1 = require("../../application/usecases/auth.usecase");
const auth_controller_1 = require("./controllers/auth.controller");
const profile_controller_1 = require("./controllers/profile.controller");
const ksp_settings_controller_1 = require("./controllers/ksp-settings.controller");
const report_controller_1 = require("./controllers/report.controller");
const auth_route_1 = require("./routes/auth.route");
const error_middleware_1 = require("./middleware/error.middleware");
(0, dotenv_1.config)();
const createApp = async () => {
    await connection_1.database.connect();
    const pool = connection_1.database.getPool();
    const userRepository = new postgres_user_repository_1.PostgresUserRepository(pool);
    const memberRepository = new postgres_member_repository_1.PostgresMemberRepository(pool);
    const savingsRepository = new postgres_savings_repository_1.PostgresSavingsRepository(pool);
    const loanRepository = new postgres_loan_repository_1.PostgresLoanRepository(pool);
    const kspSettingsRepository = new postgres_ksp_settings_repository_1.PostgresKSPSettingsRepository(pool);
    const jwtService = new jwt_1.JwtService();
    const authUseCase = new auth_usecase_1.AuthUseCase(userRepository, jwtService);
    const authController = new auth_controller_1.AuthController(authUseCase);
    const profileController = new profile_controller_1.ProfileController(userRepository);
    const kspSettingsController = new ksp_settings_controller_1.KSPSettingsController(kspSettingsRepository);
    const reportController = new report_controller_1.ReportController(savingsRepository, loanRepository, kspSettingsRepository, pool);
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, morgan_1.default)('dev'));
    app.get('/', (req, res) => {
        res.status(200).json({
            status: 'success',
            message: 'KSP Mulia Dana Sejahtera API Running'
        });
    });
    app.get('/health', (req, res) => {
        res.status(200).json({ status: 'ok' });
    });
    app.use('/api/auth', (0, auth_route_1.createAuthRouter)(authController));
    app.use('/api/profile', (0, profile_controller_1.createProfileRouter)(profileController));
    app.use('/api/pengaturan-ksp', (0, ksp_settings_controller_1.createKSPSettingsRouter)(kspSettingsController));
    app.use('/api/laporan', (0, report_controller_1.createReportRouter)(reportController));
    app.use(error_middleware_1.notFoundHandler);
    app.use(error_middleware_1.errorHandler);
    return app;
};
exports.createApp = createApp;
//# sourceMappingURL=app.js.map