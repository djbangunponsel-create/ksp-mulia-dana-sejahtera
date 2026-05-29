import { Pool } from 'pg';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

config();

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

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private pool: Pool;

  private constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      user: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'koperasi_db',
    });
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public getPool(): Pool {
    return this.pool;
  }

  public async connect(): Promise<void> {
    try {
      await this.pool.connect();
      console.log('Database connected successfully');
      await this.runMigrations();
    } catch (error) {
      console.error('Database connection error:', error);
      console.log('Server will continue without database connection');
    }
  }

  public async disconnect(): Promise<void> {
    await this.pool.end();
    console.log('Database disconnected');
  }

  private async runMigrations(): Promise<void> {
    try {
      await this.pool.query(KSP_SETTINGS_TABLE);
      console.log('KSP settings table ensured');
    } catch (error) {
      console.error('Migration error:', error);
    }
  }
}

export const database = DatabaseConnection.getInstance();
export type DatabasePool = Pool;