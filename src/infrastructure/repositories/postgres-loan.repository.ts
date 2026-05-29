import { Pool } from 'pg';
import { LoanRepository } from '../../domain/repositories';
import { Loan, LoanStatus } from '../../domain/entities';

export class PostgresLoanRepository implements LoanRepository {
  constructor(private pool: Pool) {}

  async create(loan: Omit<Loan, 'id' | 'createdAt' | 'updatedAt' | 'loanNumber'>): Promise<Loan> {
    const loanNumber = await this.getNextLoanNumber();
    
    const result = await this.pool.query(
      `INSERT INTO loans (member_id, loan_number, amount, interest_rate, tenure, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *, id as "id"`,
      [loan.memberId, loanNumber, loan.amount, loan.interestRate, loan.tenure, loan.status || 'pending']
    );

    const row = result.rows[0];
    return this.mapRowToLoan(row);
  }

  async findById(id: string): Promise<Loan | null> {
    const result = await this.pool.query(
      'SELECT id, member_id as "memberId", loan_number as "loanNumber", amount, interest_rate as "interestRate", tenure, status, disbursement_date as "disbursementDate", due_date as "dueDate", created_at as "createdAt", updated_at as "updatedAt" FROM loans WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) return null;
    return this.mapRowToLoan(result.rows[0]);
  }

  async findByLoanNumber(loanNumber: string): Promise<Loan | null> {
    const result = await this.pool.query(
      'SELECT id, member_id as "memberId", loan_number as "loanNumber", amount, interest_rate as "interestRate", tenure, status, disbursement_date as "disbursementDate", due_date as "dueDate", created_at as "createdAt", updated_at as "updatedAt" FROM loans WHERE loan_number = $1',
      [loanNumber]
    );

    if (result.rows.length === 0) return null;
    return this.mapRowToLoan(result.rows[0]);
  }

  async findAll(): Promise<Loan[]> {
    const result = await this.pool.query(
      'SELECT id, member_id as "memberId", loan_number as "loanNumber", amount, interest_rate as "interestRate", tenure, status, disbursement_date as "disbursementDate", due_date as "dueDate", created_at as "createdAt", updated_at as "updatedAt" FROM loans'
    );

    return result.rows.map(this.mapRowToLoan);
  }

  async findByMemberId(memberId: string): Promise<Loan[]> {
    const result = await this.pool.query(
      'SELECT id, member_id as "memberId", loan_number as "loanNumber", amount, interest_rate as "interestRate", tenure, status, disbursement_date as "disbursementDate", due_date as "dueDate", created_at as "createdAt", updated_at as "updatedAt" FROM loans WHERE member_id = $1',
      [memberId]
    );

    return result.rows.map(this.mapRowToLoan);
  }

  async update(id: string, data: Partial<Loan>): Promise<Loan | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let index = 1;

    if (data.amount !== undefined) {
      fields.push(`amount = $${index++}`);
      values.push(data.amount);
    }
    if (data.interestRate !== undefined) {
      fields.push(`interest_rate = $${index++}`);
      values.push(data.interestRate);
    }
    if (data.tenure !== undefined) {
      fields.push(`tenure = $${index++}`);
      values.push(data.tenure);
    }
    if (data.status !== undefined) {
      fields.push(`status = $${index++}`);
      values.push(data.status);
    }
    if (data.disbursementDate !== undefined) {
      fields.push(`disbursement_date = $${index++}`);
      values.push(data.disbursementDate);
    }
    if (data.dueDate !== undefined) {
      fields.push(`due_date = $${index++}`);
      values.push(data.dueDate);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const query = `UPDATE loans SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${index} RETURNING *`;
    
    await this.pool.query(query, values);
    return this.findById(id);
  }

  async getNextLoanNumber(): Promise<string> {
    const result = await this.pool.query(
      'SELECT COALESCE(MAX(CAST(SUBSTRING(loan_number FROM 4) AS INTEGER)), 0) + 1 as next_number FROM loans'
    );
    
    const nextNumber = (result.rows[0] as { next_number: number }).next_number;
    return `LN-${String(nextNumber).padStart(6, '0')}`;
  }

  private mapRowToLoan(row: Record<string, unknown>): Loan {
    return {
      id: row.id as string,
      memberId: row.memberId as string,
      loanNumber: row.loanNumber as string,
      amount: row.amount as number,
      interestRate: row.interestRate as number,
      tenure: row.tenure as number,
      status: row.status as LoanStatus,
      disbursementDate: row.disbursementDate as Date | null,
      dueDate: row.dueDate as Date | null,
      createdAt: row.createdAt as Date,
      updatedAt: row.updatedAt as Date,
    };
  }
}