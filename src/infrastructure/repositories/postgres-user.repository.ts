import { Pool } from 'pg';
import { UserRepository } from '../../domain/repositories';
import { User, UserRole } from '../../domain/entities';

export class PostgresUserRepository implements UserRepository {
  constructor(private pool: Pool) {}

  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const result = await this.pool.query(
      `INSERT INTO users (email, password, name, role, is_active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *, id as "id"`,
      [user.email, user.password, user.name, user.role, user.isActive]
    );

    const row = result.rows[0];
    return this.mapRowToUser(row);
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.pool.query(
      'SELECT id, email, password, name, role, is_active as "isActive", created_at as "createdAt", updated_at as "updatedAt" FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) return null;
    return this.mapRowToUser(result.rows[0]);
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.pool.query(
      'SELECT id, email, password, name, role, is_active as "isActive", created_at as "createdAt", updated_at as "updatedAt" FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) return null;
    return this.mapRowToUser(result.rows[0]);
  }

  async findAll(): Promise<User[]> {
    const result = await this.pool.query(
      'SELECT id, email, password, name, role, is_active as "isActive", created_at as "createdAt", updated_at as "updatedAt" FROM users'
    );

    return result.rows.map(this.mapRowToUser);
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let index = 1;

    if (data.email !== undefined) {
      fields.push(`email = $${index++}`);
      values.push(data.email);
    }
    if (data.password !== undefined) {
      fields.push(`password = $${index++}`);
      values.push(data.password);
    }
    if (data.name !== undefined) {
      fields.push(`name = $${index++}`);
      values.push(data.name);
    }
    if (data.role !== undefined) {
      fields.push(`role = $${index++}`);
      values.push(data.role);
    }
    if (data.isActive !== undefined) {
      fields.push(`is_active = $${index++}`);
      values.push(data.isActive);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const query = `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${index} RETURNING *`;
    
    const result = await this.pool.query(query, values);
    if (result.rows.length === 0) return null;
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.pool.query('DELETE FROM users WHERE id = $1', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  private mapRowToUser(row: Record<string, unknown>): User {
    return {
      id: row.id as string,
      email: row.email as string,
      password: row.password as string,
      name: row.name as string,
      role: row.role as UserRole,
      isActive: row.isActive as boolean,
      createdAt: row.createdAt as Date,
      updatedAt: row.updatedAt as Date,
    };
  }
}