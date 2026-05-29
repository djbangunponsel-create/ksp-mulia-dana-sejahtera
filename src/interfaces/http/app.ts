import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from 'dotenv';
import { database } from '../../infrastructure/database/connection';
import { PostgresUserRepository } from '../../infrastructure/repositories/postgres-user.repository';
import { PostgresMemberRepository } from '../../infrastructure/repositories/postgres-member.repository';
import { PostgresSavingsRepository } from '../../infrastructure/repositories/postgres-savings.repository';
import { PostgresLoanRepository } from '../../infrastructure/repositories/postgres-loan.repository';
import { PostgresKSPSettingsRepository } from '../../infrastructure/repositories/postgres-ksp-settings.repository';
import { JwtService } from '../../infrastructure/config/jwt';
import { AuthUseCase } from '../../application/usecases/auth.usecase';
import { AuthController } from './controllers/auth.controller';
import { ProfileController, createProfileRouter } from './controllers/profile.controller';
import { KSPSettingsController, createKSPSettingsRouter } from './controllers/ksp-settings.controller';
import { ReportController, createReportRouter } from './controllers/report.controller';
import { createAuthRouter } from './routes/auth.route';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

config();

const createApp = async (): Promise<Application> => {
  await database.connect();
  
  const pool = database.getPool();
  
  const userRepository = new PostgresUserRepository(pool);
  const memberRepository = new PostgresMemberRepository(pool);
  const savingsRepository = new PostgresSavingsRepository(pool);
  const loanRepository = new PostgresLoanRepository(pool);
  const kspSettingsRepository = new PostgresKSPSettingsRepository(pool);
  
  const jwtService = new JwtService();
  
  const authUseCase = new AuthUseCase(userRepository, jwtService);
  const authController = new AuthController(authUseCase);
  const profileController = new ProfileController(userRepository);
  const kspSettingsController = new KSPSettingsController(kspSettingsRepository);
  const reportController = new ReportController(savingsRepository, loanRepository, kspSettingsRepository, pool);

  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));

  app.get('/', (req, res) => {
    res.status(200).json({ 
      status: 'success', 
      message: 'KSP Mulia Dana Sejahtera API Running' 
    });
  });

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use('/api/auth', createAuthRouter(authController));
  app.use('/api/profile', createProfileRouter(profileController));
  app.use('/api/pengaturan-ksp', createKSPSettingsRouter(kspSettingsController));
  app.use('/api/laporan', createReportRouter(reportController));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export { createApp };