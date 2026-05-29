import { UserRole, User } from '../../domain/entities';
export { UserRole, User };
export interface RegisterUserDTO {
    nama: string;
    email: string;
    password: string;
    role?: UserRole;
}
export interface LoginUserDTO {
    email: string;
    password: string;
}
export interface AuthResult {
    user: Omit<User, 'password'>;
    accessToken: string;
    refreshToken: string;
}
export interface CreateMemberDTO {
    userId: string;
    nik: string;
    address: string;
    phone: string;
}
export interface UpdateMemberDTO {
    nik?: string;
    address?: string;
    phone?: string;
    status?: string;
}
export interface CreateSavingsDTO {
    memberId: string;
    initialBalance?: number;
}
export interface SavingsTransactionDTO {
    memberId: string;
    amount: number;
    type: 'deposit' | 'withdrawal';
}
export interface CreateLoanDTO {
    memberId: string;
    amount: number;
    interestRate: number;
    tenure: number;
}
export interface UpdateLoanDTO {
    status?: string;
    disbursementDate?: Date;
    dueDate?: Date;
}
