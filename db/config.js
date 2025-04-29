import mysql from 'mysql2'
import { envConfig } from '../utils/env.js'

const pool = mysql.createPool({
    host: envConfig.DB_HOST,
    user: envConfig.DB_USER,
    password: envConfig.DB_PASSWORD,
    database: envConfig.DB_NAME,
}).promise()

const result = await pool.query('SELECT 1 + 1 AS solution')
console.log('Database connection successful:', result[0][0].solution)

export default pool;