import pool from '../db/config.js'

export const userModel = {
    createUser: async (user) => {
        const { fullname, username, email, phone, password } = user
        const sql = 'INSERT INTO users (fullname, username, email, phone, password) VALUES (?, ?, ?, ?, ?)'
        const [result] = await pool.query(sql, [fullname, username, email, phone, password])
        return result
    },

    getAllUser: async (c_page, p_limit, search, sortBy, sortOrder) => {
        const allowedSortFields = ['fullname', 'username', 'email', 'updated_at'];
        const allowedSortOrders = ['ASC', 'DESC'];

        const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'updated_at';
        const order = allowedSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

        const searchQuery = `%${search}%`
        const offset = (c_page - 1) * p_limit;

        const sql = `
            SELECT u.* FROM users u
            WHERE (
                LOWER(u.fullname) LIKE LOWER(?) OR
                LOWER(u.username) LIKE LOWER(?) OR
                LOWER(u.email) LIKE LOWER(?) OR
                LOWER(u.phone) LIKE LOWER(?)
            )
            AND u.deleted_at IS NULL
            AND u.is_actived = 1
            ORDER BY u.${sortField} ${order}
            LIMIT ? OFFSET ?
        `
        const [rows] = await pool.query(sql, [searchQuery, searchQuery, searchQuery, searchQuery, p_limit, offset])
        return rows
    },

    totalFilteredUsers: async (search) => { 
        const searchQuery = `%${search}%`

        const sql = `
            SELECT COUNT(*) AS total FROM users u
            WHERE (
                LOWER(u.fullname) LIKE LOWER(?) OR
                LOWER(u.username) LIKE LOWER(?) OR
                LOWER(u.email) LIKE LOWER(?) OR
                LOWER(u.phone) LIKE LOWER(?)
            )
            AND deleted_at IS NULL
        `
        const [rows] = await pool.query(sql, [searchQuery, searchQuery, searchQuery, searchQuery])
        return rows[0].total
    },

    getUserById: async (id) => {
        const sql = 'SELECT * FROM users WHERE id = ? AND deleted_at IS NULL'
        const [rows] = await pool.query(sql, [id])
        return rows[0]
    },

    getUserbyUsername: async (username) => {
        const sql = 'SELECT * FROM users WHERE username = ? AND deleted_at IS NULL'
        const [rows] = await pool.query(sql, [username])
        return rows[0]
    },

    updateUser: async (id, user) => { 
        const { fullname, username, email, phone, password } = user
        const sql = 'UPDATE users SET fullname = ?, username = ?, email = ?, phone = ?, password = ?, updated_at = NOW() WHERE id = ?'
        const [result] = await pool.query(sql, [fullname, username, email, phone, password, id])
        return result
    },

    softDeleteUser: async (id) => { 
        const sql = 'UPDATE users SET deleted_at = NOW() WHERE id = ?'
        const [result] = await pool.query(sql, [id])
        return result
    },

    addToken: async (id, token) => { 
        const sql = 'UPDATE users SET token = ?, updated_at = NOW() WHERE id = ?'
        const [result] = await pool.query(sql, [token, id])
        return result
    },

    uploadImage: async (id, image) => { 
        const sql = 'UPDATE users SET image = ?, updated_at = NOW() WHERE id = ?'
        const [result] = await pool.query(sql, [image, id])
        return result
    }

}