import { JwtPayload } from '../../../infrastructure/config/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}