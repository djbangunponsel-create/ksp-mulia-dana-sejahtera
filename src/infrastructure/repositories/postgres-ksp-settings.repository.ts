import { Pool } from 'pg';
import { KSPSettingsRepository } from '../../domain/repositories';
import { KSPSettings } from '../../domain/entities';

export class PostgresKSPSettingsRepository implements KSPSettingsRepository {
  constructor(private pool: Pool) {}

  async get(): Promise<KSPSettings | null> {
    const result = await this.pool.query(
      'SELECT id, nama, badan_hukum, alamat, email, telepon, created_at as "createdAt", updated_at as "updatedAt" FROM ksp_settings LIMIT 1'
    );

    if (result.rows.length === 0) return null;
    return this.mapRowToKSPSettings(result.rows[0]);
  }

  async update(data: Omit<KSPSettings, 'id' | 'createdAt' | 'updatedAt'>): Promise<KSPSettings> {
    const existing = await this.get();

    if (existing) {
      const result = await this.pool.query(
        `UPDATE ksp_settings 
         SET nama = $1, badan_hukum = $2, alamat = $3, email = $4, telepon = $5, updated_at = NOW()
         WHERE id = $6
         RETURNING *`,
        [data.nama, data.badan_hukum, data.alamat, data.email, data.telepon, existing.id]
      );
      return this.mapRowToKSPSettings(result.rows[0]);
    }

    const result = await this.pool.query(
      `INSERT INTO ksp_settings (nama, badan_hukum, alamat, email, telepon)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [data.nama, data.badan_hukum, data.alamat, data.email, data.telepon]
    );
    return this.mapRowToKSPSettings(result.rows[0]);
  }

  private mapRowToKSPSettings(row: Record<string, unknown>): KSPSettings {
    return {
      id: row.id as string,
      nama: row.nama as string,
      badan_hukum: row.badan_hukum as string,
      alamat: row.alamat as string,
      email: row.email as string,
      telepon: row.telepon as string,
      createdAt: row.createdAt as Date,
      updatedAt: row.updatedAt as Date,
    };
  }
}