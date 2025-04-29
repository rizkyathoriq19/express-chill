import pool from '../db/config.js';

export const movieModel = {
    getAllMovies: async () => { 
        const sql = 'SELECT * FROM movies WHERE deleted_at IS NULL';
        const [rows] = await pool.query(sql);
        return rows;
    },

    getMovieById: async (id) => { 
        const sql = 'SELECT * FROM movies WHERE id = ? AND deleted_at IS NULL';
        const [rows] = await pool.query(sql, [id]);
        return rows[0];
    },

    updateMovie: async (id, movie) => { 
        const { title, duration, release_date, rating, genre_id } = movie;
        const sql = 'UPDATE movies SET title = ?, duration = ?, release_date = ?, rating = ?, genre_id = ?, updated_at = NOW() WHERE id = ?';
        const [result] = await pool.query(sql, [title, duration, release_date, rating, genre_id, id]);
        return result;
    },

    softDeleteMovie: async (id) => { 
        const sql = 'UPDATE movies SET deleted_at = NOW() WHERE id = ?';
        const [result] = await pool.query(sql, [id]);
        return result;
    },

    createMovie: async (movie) => { 
        const { title, duration, release_date, rating, genre_id } = movie;
        const sql = 'INSERT INTO movies (title, duration, release_date, rating, genre_id) VALUES (?, ?, ?, ?, ?)';
        const [result] = await pool.query(sql, [title, duration, release_date, rating, genre_id]);
        return result;
    },
}