import pool from '../db/config.js';

export const movieModel = {
    getAllMovies: async (page, limit, search, sortBy, sortOrder, genre) => {
        const allowedSortFields = ['id', 'title', 'duration', 'release_date', 'rating', 'genre_name', 'updated_at'];
        const allowedSortOrders = ['ASC', 'DESC'];

        const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'updated_at';
        const order = allowedSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

        const searchQuery = `%${search}%`
        const offset = (page - 1) * limit;

        let sql = `
            SELECT m.id, m.title, m.duration, m.release_date, m.rating, g.id AS genre_id, g.name AS genre_name
            FROM movies m
            JOIN genres g ON m.genre_id = g.id
            WHERE LOWER(m.title) LIKE LOWER(?)
            AND deleted_at IS NULL
        `

        const params = [searchQuery];

        if (genre) {
            sql += ' AND LOWER(g.name) = LOWER(?) ';
            params.push(genre);
        }

        sql += ` ORDER BY m.${sortField} ${order} LIMIT ? OFFSET ?`;
        params.push(limit, offset); 


        const [rows] = await pool.query(sql, params)
        return rows
    },

    totalFilteredMovies: async (search, genre) => {
        const searchQuery = `%${search}%`;

        let sql = `
            SELECT COUNT(*) AS total
            FROM movies m
            JOIN genres g ON m.genre_id = g.id
            WHERE LOWER(m.title) LIKE LOWER(?)
            AND m.deleted_at IS NULL
        `;

        const params = [searchQuery];

        if (genre) {
            sql += ` AND LOWER(g.name) = LOWER(?)`;
            params.push(genre);
        }

        const [rows] = await pool.query(sql, params);
        return rows[0].total;
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

    uploadImage: async (id, image) => { 
        const sql = 'UPDATE movies SET image = ?, updated_at = NOW() WHERE id = ?';
        const [result] = await pool.query(sql, [image, id]);
        return result;
    }
}