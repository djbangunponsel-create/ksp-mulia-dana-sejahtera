import { Pool } from 'pg';
import { UserRepository } from '../../domain/repositories';
import { User } from '../../domain/entities';
export declare class PostgresUserRepository implements UserRepository {
    private pool;
    constructor(pool: Pool);
    create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    update(id: string, data: Partial<User>): Promise<User | null>;
    delete(id: string): Promise<boolean>;
    private mapRowToUser;
}
