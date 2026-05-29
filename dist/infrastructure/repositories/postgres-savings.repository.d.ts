import { Pool } from 'pg';
import { SavingsRepository } from '../../domain/repositories';
import { Savings } from '../../domain/entities';
export declare class PostgresSavingsRepository implements SavingsRepository {
    private pool;
    constructor(pool: Pool);
    create(savings: Omit<Savings, 'id' | 'createdAt' | 'updatedAt'>): Promise<Savings>;
    findById(id: string): Promise<Savings | null>;
    findByMemberId(memberId: string): Promise<Savings | null>;
    update(id: string, data: Partial<Savings>): Promise<Savings | null>;
    updateBalance(memberId: string, amount: number): Promise<Savings | null>;
    private mapRowToSavings;
}
