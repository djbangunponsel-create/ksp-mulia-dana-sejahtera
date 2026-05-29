"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = exports.DatabaseConnection = void 0;
const pg_1 = require("pg");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
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
}
exports.DatabaseConnection = DatabaseConnection;
exports.database = DatabaseConnection.getInstance();
//# sourceMappingURL=connection.js.map