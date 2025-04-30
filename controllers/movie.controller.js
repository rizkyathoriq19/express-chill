import { movieModel } from "../model/movie.model.js";
import { deleteImage, getPublicIdFromUrl, uploadImageFromBuffer } from "../utils/cloudinary.js";

export const movieController = {
    getAllMovies: async (req, res) => {
        try {
            const { c_page = 1, p_limit = 10, search = '', sortBy = 'updated_at', sortOrder = 'DESC', genre = '' } = req.query
            const page = Math.max(1, Number(c_page) || 1);
            const limit = Math.max(1, Math.min(100, Number(p_limit) || 10));

            const t_items = await movieModel.totalFilteredMovies(search, genre) 
            const t_page = Math.ceil(t_items / limit) 

            const movies = await movieModel.getAllMovies(page, limit, search, sortBy, sortOrder, genre);
            
            res.status(200).json({
                message: "Movies fetched successfully",
                metadata: {
                    current_page: page,
                    total_page: t_page,
                    total_items: t_items,
                },
                data: movies
            });
        } catch (error) {
            res.status(500).json({ message: "Error fetching movies", error });
        }
    },

    getMovieById: async (req, res) => {
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

    createMovie: async (req, res) => {
        const { title, duration, release_date, rating, genre_id } = req.body;
        try {
            const newMovie = await movieModel.createMovie({ title, duration, release_date, rating, genre_id });
            res.status(201).json({message: "Movie created successfully", data: newMovie});
        } catch (error) {
            res.status(500).json({ message: "Error creating movie", error });
        }
    },

    updateMovie: async (req, res) => {
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

    softDeleteMovie: async (req, res) => {
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

    uploadImage: async (req, res) => { 
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' })
            }

            const { id } = req.params

            const movie = await movieModel.getMovieById(id)
            if (!movie) {
                return res.status(404).json({ message: 'Movie not found' })
            }

            if (movie.image) {
                const oldImagePublicId = await getPublicIdFromUrl(movie.image)
                if (oldImagePublicId) await deleteImage(oldImagePublicId)
            }
            
            const imagePath = req.file.buffer
            const uploadImage = await uploadImageFromBuffer(imagePath, 'harisenin')
            if (!uploadImage) {
                return res.status(500).json({ message: 'Error uploading image' })
            }
            
            await movieModel.uploadImage(id, uploadImage.secure_url)

            res.status(200).json({ message: 'Image uploaded successfully'})
        } catch (err) {
            return res.status(500).json({ message: 'Upload failed' });
        }
    }
}   