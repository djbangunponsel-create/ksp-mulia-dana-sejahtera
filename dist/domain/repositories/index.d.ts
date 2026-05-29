import { User, Member, Savings, Loan, KSPSettings } from '../entities';
export interface KSPSettingsRepository {
    get(): Promise<KSPSettings | null>;
    update(data: Omit<KSPSettings, 'id' | 'createdAt' | 'updatedAt'>): Promise<KSPSettings>;
}
export interface UserRepository {
    create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    update(id: string, data: Partial<User>): Promise<User | null>;
    delete(id: string): Promise<boolean>;
}
export interface MemberRepository {
    create(member: Omit<Member, 'id' | 'createdAt' | 'updatedAt' | 'memberNumber'>): Promise<Member>;
    findById(id: string): Promise<Member | null>;
    findByMemberNumber(memberNumber: string): Promise<Member | null>;
    findByUserId(userId: string): Promise<Member | null>;
    findAll(): Promise<Member[]>;
    update(id: string, data: Partial<Member>): Promise<Member | null>;
    delete(id: string): Promise<boolean>;
    getNextMemberNumber(): Promise<string>;
}
export interface SavingsRepository {
    create(savings: Omit<Savings, 'id' | 'createdAt' | 'updatedAt'>): Promise<Savings>;
    findById(id: string): Promise<Savings | null>;
    findByMemberId(memberId: string): Promise<Savings | null>;
    update(id: string, data: Partial<Savings>): Promise<Savings | null>;
    updateBalance(memberId: string, amount: number): Promise<Savings | null>;
}
export interface LoanRepository {
    create(loan: Omit<Loan, 'id' | 'createdAt' | 'updatedAt' | 'loanNumber'>): Promise<Loan>;
    findById(id: string): Promise<Loan | null>;
    findByLoanNumber(loanNumber: string): Promise<Loan | null>;
    findAll(): Promise<Loan[]>;
    findByMemberId(memberId: string): Promise<Loan[]>;
    update(id: string, data: Partial<Loan>): Promise<Loan | null>;
    getNextLoanNumber(): Promise<string>;
}
