import { Pool } from 'pg';
import { MemberRepository } from '../../domain/repositories';
import { Member, MemberStatus } from '../../domain/entities';

export class PostgresMemberRepository implements MemberRepository {
  constructor(private pool: Pool) {}

  async create(member: Omit<Member, 'id' | 'createdAt' | 'updatedAt' | 'memberNumber'>): Promise<Member> {
    const memberNumber = await this.getNextMemberNumber();
    
    const result = await this.pool.query(
      `INSERT INTO members (user_id, member_number, nik, address, phone, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *, id as "id"`,
      [member.userId, memberNumber, member.nik, member.address, member.phone, member.status || 'active']
    );

    const row = result.rows[0];
    return this.mapRowToMember(row);
  }

  async findById(id: string): Promise<Member | null> {
    const result = await this.pool.query(
      'SELECT id, user_id as "userId", member_number as "memberNumber", nik, address, phone, status, join_date as "joinDate", created_at as "createdAt", updated_at as "updatedAt" FROM members WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) return null;
    return this.mapRowToMember(result.rows[0]);
  }

  async findByMemberNumber(memberNumber: string): Promise<Member | null> {
    const result = await this.pool.query(
      'SELECT id, user_id as "userId", member_number as "memberNumber", nik, address, phone, status, join_date as "joinDate", created_at as "createdAt", updated_at as "updatedAt" FROM members WHERE member_number = $1',
      [memberNumber]
    );

    if (result.rows.length === 0) return null;
    return this.mapRowToMember(result.rows[0]);
  }

  async findByUserId(userId: string): Promise<Member | null> {
    const result = await this.pool.query(
      'SELECT id, user_id as "userId", member_number as "memberNumber", nik, address, phone, status, join_date as "joinDate", created_at as "createdAt", updated_at as "updatedAt" FROM members WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) return null;
    return this.mapRowToMember(result.rows[0]);
  }

  async findAll(): Promise<Member[]> {
    const result = await this.pool.query(
      'SELECT id, user_id as "userId", member_number as "memberNumber", nik, address, phone, status, join_date as "joinDate", created_at as "createdAt", updated_at as "updatedAt" FROM members'
    );

    return result.rows.map(this.mapRowToMember);
  }

  async update(id: string, data: Partial<Member>): Promise<Member | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let index = 1;

    if (data.nik !== undefined) {
      fields.push(`nik = $${index++}`);
      values.push(data.nik);
    }
    if (data.address !== undefined) {
      fields.push(`address = $${index++}`);
      values.push(data.address);
    }
    if (data.phone !== undefined) {
      fields.push(`phone = $${index++}`);
      values.push(data.phone);
    }
    if (data.status !== undefined) {
      fields.push(`status = $${index++}`);
      values.push(data.status);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const query = `UPDATE members SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${index} RETURNING *`;
    
    await this.pool.query(query, values);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.pool.query('DELETE FROM members WHERE id = $1', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getNextMemberNumber(): Promise<string> {
    const result = await this.pool.query(
      'SELECT COALESCE(MAX(CAST(SUBSTRING(member_number FROM 4) AS INTEGER)), 0) + 1 as next_number FROM members'
    );
    
    const nextNumber = (result.rows[0] as { next_number: number }).next_number;
    return `MK-${String(nextNumber).padStart(6, '0')}`;
  }

  private mapRowToMember(row: Record<string, unknown>): Member {
    return {
      id: row.id as string,
      userId: row.userId as string,
      memberNumber: row.memberNumber as string,
      nik: row.nik as string,
      address: row.address as string,
      phone: row.phone as string,
      status: row.status as MemberStatus,
      joinDate: row.joinDate as Date,
      createdAt: row.createdAt as Date,
      updatedAt: row.updatedAt as Date,
    };
  }
}