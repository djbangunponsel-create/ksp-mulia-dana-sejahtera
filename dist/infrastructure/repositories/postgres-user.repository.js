"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresUserRepository = void 0;
class PostgresUserRepository {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async create(user) {
        const result = await this.pool.query(`INSERT INTO users (nama, email, password, role, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`, [user.nama, user.email, user.password, user.role, user.status]);
        const row = result.rows[0];
        return this.mapRowToUser(row);
    }
    async findById(id) {
        const result = await this.pool.query('SELECT id, nama, email, password, role, status, created_at as "createdAt", updated_at as "updatedAt" FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0)
            return null;
        return this.mapRowToUser(result.rows[0]);
    }
    async findByEmail(email) {
        const result = await this.pool.query('SELECT id, nama, email, password, role, status, created_at as "createdAt", updated_at as "updatedAt" FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0)
            return null;
        return this.mapRowToUser(result.rows[0]);
    }
    async findAll() {
        const result = await this.pool.query('SELECT id, nama, email, password, role, status, created_at as "createdAt", updated_at as "updatedAt" FROM users');
        return result.rows.map(this.mapRowToUser);
    }
    async update(id, data) {
        const fields = [];
        const values = [];
        let index = 1;
        if (data.nama !== undefined) {
            fields.push(`nama = $${index++}`);
            values.push(data.nama);
        }
        if (data.email !== undefined) {
            fields.push(`email = $${index++}`);
            values.push(data.email);
        }
        if (data.password !== undefined) {
            fields.push(`password = $${index++}`);
            values.push(data.password);
        }
        if (data.role !== undefined) {
            fields.push(`role = $${index++}`);
            values.push(data.role);
        }
        if (data.status !== undefined) {
            fields.push(`status = $${index++}`);
            values.push(data.status);
        }
        if (fields.length === 0) {
            return this.findById(id);
        }
        values.push(id);
        const query = `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${index} RETURNING *`;
        const result = await this.pool.query(query, values);
        if (result.rows.length === 0)
            return null;
        return this.findById(id);
    }
    async delete(id) {
        const result = await this.pool.query('DELETE FROM users WHERE id = $1', [id]);
        return result.rowCount !== null && result.rowCount > 0;
    }
    mapRowToUser(row) {
        return {
            id: row.id,
            nama: row.nama,
            email: row.email,
            password: row.password,
            role: row.role,
            status: row.status,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
        };
    }
}
exports.PostgresUserRepository = PostgresUserRepository;
//# sourceMappingURL=postgres-user.repository.js.map