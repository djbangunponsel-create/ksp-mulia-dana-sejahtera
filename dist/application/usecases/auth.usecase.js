"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUseCase = void 0;
const entities_1 = require("../../domain/entities");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class AuthUseCase {
    userRepository;
    jwtService;
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async register(data) {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        const hashedPassword = await bcryptjs_1.default.hash(data.password, parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10));
        const user = await this.userRepository.create({
            nama: data.nama,
            email: data.email,
            password: hashedPassword,
            role: data.role ?? entities_1.UserRole.MEMBER,
            status: 'active'
        });
        return this.generateAuthResult(user);
    }
    async login(data) {
        const user = await this.userRepository.findByEmail(data.email);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const isPasswordValid = await bcryptjs_1.default.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
        if (user.status !== 'active') {
            throw new Error('Account is inactive');
        }
        return this.generateAuthResult(user);
    }
    generateAuthResult(user) {
        const userWithoutPassword = {
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
exports.AuthUseCase = AuthUseCase;
//# sourceMappingURL=auth.usecase.js.map