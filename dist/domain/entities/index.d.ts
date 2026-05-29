export interface User {
    id: string;
    nama: string;
    email: string;
    password: string;
    role: UserRole;
    status: 'active' | 'inactive';
    createdAt: Date;
    updatedAt: Date;
}
export declare enum UserRole {
    ADMIN = "admin",
    MANAGER = "manager",
    STAFF = "staff",
    MEMBER = "member"
}
export interface Member {
    id: string;
    userId: string;
    memberNumber: string;
    nik: string;
    address: string;
    phone: string;
    joinDate: Date;
    status: MemberStatus;
    createdAt: Date;
    updatedAt: Date;
}
export declare enum MemberStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended"
}
export interface Savings {
    id: string;
    memberId: string;
    balance: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface Loan {
    id: string;
    memberId: string;
    loanNumber: string;
    amount: number;
    interestRate: number;
    tenure: number;
    status: LoanStatus;
    disbursementDate: Date | null;
    dueDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
export declare enum LoanStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    DISBURSED = "disbursed",
    PAID = "paid",
    DEFAULTED = "defaulted"
}
export interface KSPSettings {
    id: string;
    nama: string;
    badan_hukum: string;
    alamat: string;
    email: string;
    telepon: string;
    createdAt: Date;
    updatedAt: Date;
}
