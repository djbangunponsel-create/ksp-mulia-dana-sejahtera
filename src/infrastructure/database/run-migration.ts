import { Pool } from 'pg';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

config();

async function runMigration() {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'koperasi_db',
  });

  try {
    const migrationPath = path.join(__dirname, 'migrations.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');
    
    await pool.query(migrationSQL);
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();