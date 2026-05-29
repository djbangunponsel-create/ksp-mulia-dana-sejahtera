import { Pool } from 'pg';
import { SavingsRepository } from '../../domain/repositories';
import { Savings } from '../../domain/entities';

export class PostgresSavingsRepository implements SavingsRepository {
  constructor(private pool: Pool) {}

  async create(savings: Omit<Savings, 'id' | 'createdAt' | 'updatedAt'>): Promise<Savings> {
    const result = await this.pool.query(
      `INSERT INTO savings (member_id, balance, is_active)
       VALUES ($1, $2, $3)
       RETURNING *, id as "id"`,
      [savings.memberId, savings.balance || 0, savings.isActive ?? true]
    );

    const row = result.rows[0];
    return this.mapRowToSavings(row);
  }

  async findById(id: string): Promise<Savings | null> {
    const result = await this.pool.query(
      'SELECT id, member_id as "memberId", balance, is_active as "isActive", created_at as "createdAt", updated_at as "updatedAt" FROM savings WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) return null;
    return this.mapRowToSavings(result.rows[0]);
  }

  async findByMemberId(memberId: string): Promise<Savings | null> {
    const result = await this.pool.query(
      'SELECT id, member_id as "memberId", balance, is_active as "isActive", created_at as "createdAt", updated_at as "updatedAt" FROM savings WHERE member_id = $1',
      [memberId]
    );

    if (result.rows.length === 0) return null;
    return this.mapRowToSavings(result.rows[0]);
  }

  async update(id: string, data: Partial<Savings>): Promise<Savings | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let index = 1;

    if (data.balance !== undefined) {
      fields.push(`balance = $${index++}`);
      values.push(data.balance);
    }
    if (data.isActive !== undefined) {
      fields.push(`is_active = $${index++}`);
      values.push(data.isActive);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const query = `UPDATE savings SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${index} RETURNING *`;
    
    await this.pool.query(query, values);
    return this.findById(id);
  }

  async updateBalance(memberId: string, amount: number): Promise<Savings | null> {
    const result = await this.pool.query(
      `UPDATE savings SET balance = balance + $1, updated_at = NOW()
       WHERE member_id = $2
       RETURNING id, member_id as "memberId", balance, is_active as "isActive", created_at as "createdAt", updated_at as "updatedAt"`,
      [amount, memberId]
    );

    if (result.rows.length === 0) return null;
    return this.mapRowToSavings(result.rows[0]);
  }

  private mapRowToSavings(row: Record<string, unknown>): Savings {
    return {
      id: row.id as string,
      memberId: row.memberId as string,
      balance: row.balance as number,
      isActive: row.isActive as boolean,
      createdAt: row.createdAt as Date,
      updatedAt: row.updatedAt as Date,
    };
  }
}