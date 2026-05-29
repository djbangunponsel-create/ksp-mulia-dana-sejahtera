"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresLoanRepository = void 0;
class PostgresLoanRepository {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async create(loan) {
        const loanNumber = await this.getNextLoanNumber();
        const result = await this.pool.query(`INSERT INTO loans (member_id, loan_number, amount, interest_rate, tenure, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *, id as "id"`, [loan.memberId, loanNumber, loan.amount, loan.interestRate, loan.tenure, loan.status || 'pending']);
        const row = result.rows[0];
        return this.mapRowToLoan(row);
    }
    async findById(id) {
        const result = await this.pool.query('SELECT id, member_id as "memberId", loan_number as "loanNumber", amount, interest_rate as "interestRate", tenure, status, disbursement_date as "disbursementDate", due_date as "dueDate", created_at as "createdAt", updated_at as "updatedAt" FROM loans WHERE id = $1', [id]);
        if (result.rows.length === 0)
            return null;
        return this.mapRowToLoan(result.rows[0]);
    }
    async findByLoanNumber(loanNumber) {
        const result = await this.pool.query('SELECT id, member_id as "memberId", loan_number as "loanNumber", amount, interest_rate as "interestRate", tenure, status, disbursement_date as "disbursementDate", due_date as "dueDate", created_at as "createdAt", updated_at as "updatedAt" FROM loans WHERE loan_number = $1', [loanNumber]);
        if (result.rows.length === 0)
            return null;
        return this.mapRowToLoan(result.rows[0]);
    }
    async findAll() {
        const result = await this.pool.query('SELECT id, member_id as "memberId", loan_number as "loanNumber", amount, interest_rate as "interestRate", tenure, status, disbursement_date as "disbursementDate", due_date as "dueDate", created_at as "createdAt", updated_at as "updatedAt" FROM loans');
        return result.rows.map(this.mapRowToLoan);
    }
    async findByMemberId(memberId) {
        const result = await this.pool.query('SELECT id, member_id as "memberId", loan_number as "loanNumber", amount, interest_rate as "interestRate", tenure, status, disbursement_date as "disbursementDate", due_date as "dueDate", created_at as "createdAt", updated_at as "updatedAt" FROM loans WHERE member_id = $1', [memberId]);
        return result.rows.map(this.mapRowToLoan);
    }
    async update(id, data) {
        const fields = [];
        const values = [];
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
    async getNextLoanNumber() {
        const result = await this.pool.query('SELECT COALESCE(MAX(CAST(SUBSTRING(loan_number FROM 4) AS INTEGER)), 0) + 1 as next_number FROM loans');
        const nextNumber = result.rows[0].next_number;
        return `LN-${String(nextNumber).padStart(6, '0')}`;
    }
    mapRowToLoan(row) {
        return {
            id: row.id,
            memberId: row.memberId,
            loanNumber: row.loanNumber,
            amount: row.amount,
            interestRate: row.interestRate,
            tenure: row.tenure,
            status: row.status,
            disbursementDate: row.disbursementDate,
            dueDate: row.dueDate,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
        };
    }
}
exports.PostgresLoanRepository = PostgresLoanRepository;
//# sourceMappingURL=postgres-loan.repository.js.map