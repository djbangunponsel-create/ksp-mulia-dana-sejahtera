import jwt from 'jsonwebtoken';

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export class JwtService {
  private secret: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || 'default-secret';
  }

  generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: '7d' as unknown as number,
    });
  }

  generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: '30d' as unknown as number,
    });
  }

  verifyToken(token: string): JwtPayload {
    return jwt.verify(token, this.secret) as JwtPayload;
  }

  decodeToken(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch {
      return null;
    }
  }
}