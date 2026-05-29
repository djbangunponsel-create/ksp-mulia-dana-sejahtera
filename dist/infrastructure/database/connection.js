"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = exports.DatabaseConnection = void 0;
const pg_1 = require("pg");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const KSP_SETTINGS_TABLE = `
CREATE TABLE IF NOT EXISTS ksp_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama VARCHAR(255) NOT NULL,
  badan_hukum VARCHAR(255) NOT NULL,
  alamat TEXT NOT NULL,
  email VARCHAR(255) NOT NULL,
  telepon VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`;
class DatabaseConnection {
    static instance;
    pool;
    constructor() {
        this.pool = new pg_1.Pool({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432', 10),
            user: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: process.env.DB_DATABASE || 'koperasi_db',
        });
    }
    static getInstance() {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }
    getPool() {
        return this.pool;
    }
    async connect() {
        try {
            await this.pool.connect();
            console.log('Database connected successfully');
            await this.runMigrations();
        }
        catch (error) {
            console.error('Database connection error:', error);
            console.log('Server will continue without database connection');
        }
    }
    async disconnect() {
        await this.pool.end();
        console.log('Database disconnected');
    }
    async runMigrations() {
        try {
            await this.pool.query(KSP_SETTINGS_TABLE);
            console.log('KSP settings table ensured');
        }
        catch (error) {
            console.error('Migration error:', error);
        }
    }
}
exports.DatabaseConnection = DatabaseConnection;
exports.database = DatabaseConnection.getInstance();
//# sourceMappingURL=connection.js.map