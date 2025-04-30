import mysql from 'mysql2'
import { envConfig } from '../utils/env.js'

const pool = mysql.createPool({
    host: envConfig.DB_HOST,
    user: envConfig.DB_USER,
    password: envConfig.DB_PASSWORD,
    database: envConfig.DB_NAME,
}).promise()

const result = await pool.query('SELECT VERSION()')
if (result[0].length === 0) {
    console.error('Database connection failed')
    process.exit(1)
}
console.log('Database connection successful:', result[0][0]['VERSION()'])

export default pool;