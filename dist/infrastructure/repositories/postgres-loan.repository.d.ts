import { Pool } from 'pg';
import { LoanRepository } from '../../domain/repositories';
import { Loan } from '../../domain/entities';
export declare class PostgresLoanRepository implements LoanRepository {
    private pool;
    constructor(pool: Pool);
    create(loan: Omit<Loan, 'id' | 'createdAt' | 'updatedAt' | 'loanNumber'>): Promise<Loan>;
    findById(id: string): Promise<Loan | null>;
    findByLoanNumber(loanNumber: string): Promise<Loan | null>;
    findAll(): Promise<Loan[]>;
    findByMemberId(memberId: string): Promise<Loan[]>;
    update(id: string, data: Partial<Loan>): Promise<Loan | null>;
    getNextLoanNumber(): Promise<string>;
    private mapRowToLoan;
}
