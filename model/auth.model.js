import pool from '../db/config.js';

export const authModel = {
    findUserByUsername: async (username) => {
        const query = 'SELECT * FROM users WHERE username = ?';
        const result = await pool.query(query, [username]);
        
        return !result.rows ? [] : result.rows[0];
    },

    findUserByEmail: async (email) => { 
        const query = 'SELECT * FROM users WHERE email = ?';
        const result = await pool.query(query, [email]);

        return !result[0][0] ? [] : result[0][0];
    },

    findUserByToken: async (token) => { 
        const query = 'SELECT * FROM users WHERE token = ?';
        const result = await pool.query(query, [token]);

        return result[0][0];
    },

    updateIsActived: async (id) => {
        const query = 'UPDATE users SET is_actived = 1, updated_at = NOW() WHERE id = ?';
        const result = await pool.query(query, [id]);

        return result
    }
}