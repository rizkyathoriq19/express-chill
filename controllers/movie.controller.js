import { movieModel } from "../model/movie.model.js";

export const movieController = {
    async getAllMovies(req, res) {
        try {
            const movies = await movieModel.getAllMovies();
            res.status(200).json(movies);
        } catch (error) {
            res.status(500).json({ message: "Error fetching movies", error });
        }
    },

    async getMovieById(req, res) {
        const { id } = req.params;
        try {
            const movie = await movieModel.getMovieById(id);
            if (!movie) {
                return res.status(404).json({ message: "Movie not found" });
            }
            res.status(200).json(movie);
        } catch (error) {
            res.status(500).json({ message: "Error fetching movie", error });
        }
    },

    async createMovie(req, res) {
        const { title, duration, release_date, rating, genre_id } = req.body;
        try {
            const newMovie = await movieModel.createMovie({ title, duration, release_date, rating, genre_id });
            res.status(201).json({message: "Movie created successfully", data: newMovie});
        } catch (error) {
            res.status(500).json({ message: "Error creating movie", error });
        }
    },

    async updateMovie(req, res) {
        const { id } = req.params;
        const { title, duration, release_date, rating, genre_id } = req.body;
        try {
            const updatedMovie = await movieModel.updateMovie(id, { title, duration, release_date, rating, genre_id });
            if (!updatedMovie) {
                return res.status(404).json({ message: "Movie not found" });
            }
            res.status(200).json({ message: "Movie updated successfully ",data: updatedMovie });
        } catch (error) {
            res.status(500).json({ message: "Error updating movie", error });
        }
    },

    async softDeleteMovie(req, res) {
        const { id } = req.params;
        try {
            const movie = await movieModel.getMovieById(id);
            if (!movie) {
                return res.status(404).json({ message: "Movie not found" });
            }
            
            await movieModel.softDeleteMovie(id);
            res.status(200).json({ message: "Movie deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting movie", error });
        }
    },
}