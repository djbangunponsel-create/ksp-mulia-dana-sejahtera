"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresKSPSettingsRepository = void 0;
class PostgresKSPSettingsRepository {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async get() {
        const result = await this.pool.query('SELECT id, nama, badan_hukum, alamat, email, telepon, created_at as "createdAt", updated_at as "updatedAt" FROM ksp_settings LIMIT 1');
        if (result.rows.length === 0)
            return null;
        return this.mapRowToKSPSettings(result.rows[0]);
    }
    async update(data) {
        const existing = await this.get();
        if (existing) {
            const result = await this.pool.query(`UPDATE ksp_settings 
         SET nama = $1, badan_hukum = $2, alamat = $3, email = $4, telepon = $5, updated_at = NOW()
         WHERE id = $6
         RETURNING *`, [data.nama, data.badan_hukum, data.alamat, data.email, data.telepon, existing.id]);
            return this.mapRowToKSPSettings(result.rows[0]);
        }
        const result = await this.pool.query(`INSERT INTO ksp_settings (nama, badan_hukum, alamat, email, telepon)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`, [data.nama, data.badan_hukum, data.alamat, data.email, data.telepon]);
        return this.mapRowToKSPSettings(result.rows[0]);
    }
    mapRowToKSPSettings(row) {
        return {
            id: row.id,
            nama: row.nama,
            badan_hukum: row.badan_hukum,
            alamat: row.alamat,
            email: row.email,
            telepon: row.telepon,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
        };
    }
}
exports.PostgresKSPSettingsRepository = PostgresKSPSettingsRepository;
//# sourceMappingURL=postgres-ksp-settings.repository.js.map