import pool from '../db/config.js'

export const userModel = {
    async createUser(user) {
        const { name, email, phone, password } = user
        const sql = 'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)'
        const [result] = await pool.query(sql, [name, email, phone, password])
        return result
    },

    async getAllUser() {
        const sql = 'SELECT * FROM users WHERE deleted_at IS NULL'
        const [rows] = await pool.query(sql)
        return rows
    },

    async getUserById(id) {
        const sql = 'SELECT * FROM users WHERE id = ? AND deleted_at IS NULL'
        const [rows] = await pool.query(sql, [id])
        return rows[0]
    },

    async getUserbyName(name) {
        const sql = 'SELECT * FROM users WHERE name = ? AND deleted_at IS NULL'
        const [rows] = await pool.query(sql, [name])
        return rows[0]
    },

    async updateUser(id, user) { 
        const { name, email, phone, password } = user
        const sql = 'UPDATE users SET name = ?, email = ?, phone = ?, password = ?, updated_at = NOW() WHERE id = ?'
        const [result] = await pool.query(sql, [name, email, phone, password, id])
        return result
    },

    async softDeleteUser(id) { 
        const sql = 'UPDATE users SET deleted_at = NOW() WHERE id = ?'
        const [result] = await pool.query(sql, [id])
        return result
    }

}