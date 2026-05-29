import { Pool } from 'pg';
import { MemberRepository } from '../../domain/repositories';
import { Member } from '../../domain/entities';
export declare class PostgresMemberRepository implements MemberRepository {
    private pool;
    constructor(pool: Pool);
    create(member: Omit<Member, 'id' | 'createdAt' | 'updatedAt' | 'memberNumber'>): Promise<Member>;
    findById(id: string): Promise<Member | null>;
    findByMemberNumber(memberNumber: string): Promise<Member | null>;
    findByUserId(userId: string): Promise<Member | null>;
    findAll(): Promise<Member[]>;
    update(id: string, data: Partial<Member>): Promise<Member | null>;
    delete(id: string): Promise<boolean>;
    getNextMemberNumber(): Promise<string>;
    private mapRowToMember;
}
