import { UserRepository } from '../../domain/repositories';
import { RegisterUserDTO, LoginUserDTO, AuthResult } from '../dtos';
import { JwtService } from '../../infrastructure/config/jwt';
import { User } from '../../domain/entities';
import bcrypt from 'bcryptjs';

export class AuthUseCase {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService
  ) {}

  async register(data: RegisterUserDTO): Promise<AuthResult> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(
      data.password,
      parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10)
    );

    const user = await this.userRepository.create({
      nama: data.nama,
      email: data.email,
      password: hashedPassword,
      role: data.role ?? 'member',
      status: 'active'
    });

    return this.generateAuthResult(user);
  }

  async login(data: LoginUserDTO): Promise<AuthResult> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    if (user.status !== 'active') {
      throw new Error('Account is inactive');
    }

    return this.generateAuthResult(user);
  }

  private generateAuthResult(user: User): AuthResult {
    const userWithoutPassword: Omit<User, 'password'> = {
      id: user.id,
      nama: user.nama,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    
    const accessToken = this.jwtService.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    const refreshToken = this.jwtService.generateRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken
    };
  }
}