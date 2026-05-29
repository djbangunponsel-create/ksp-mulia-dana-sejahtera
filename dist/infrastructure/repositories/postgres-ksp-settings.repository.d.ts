import { Pool } from 'pg';
import { KSPSettingsRepository } from '../../domain/repositories';
import { KSPSettings } from '../../domain/entities';
export declare class PostgresKSPSettingsRepository implements KSPSettingsRepository {
    private pool;
    constructor(pool: Pool);
    get(): Promise<KSPSettings | null>;
    update(data: Omit<KSPSettings, 'id' | 'createdAt' | 'updatedAt'>): Promise<KSPSettings>;
    private mapRowToKSPSettings;
}
