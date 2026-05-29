import { Pool } from 'pg';
export declare class DatabaseConnection {
    private static instance;
    private pool;
    private constructor();
    static getInstance(): DatabaseConnection;
    getPool(): Pool;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
}
export declare const database: DatabaseConnection;
export type DatabasePool = Pool;
