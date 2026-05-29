import { UserRepository } from '../../domain/repositories';
import { RegisterUserDTO, LoginUserDTO, AuthResult } from '../dtos';
import { JwtService } from '../../infrastructure/config/jwt';
export declare class AuthUseCase {
    private userRepository;
    private jwtService;
    constructor(userRepository: UserRepository, jwtService: JwtService);
    register(data: RegisterUserDTO): Promise<AuthResult>;
    login(data: LoginUserDTO): Promise<AuthResult>;
    private generateAuthResult;
}
