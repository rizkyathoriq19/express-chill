import { authController } from "../controllers/auth.controller.js";
import { movieController } from "../controllers/movie.controller.js";
import { userController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import express from "express";
import { upload } from "../utils/multer.js";

const router = express.Router();

router.get("/movie", authMiddleware.verifyToken, movieController.getAllMovies);
router.get("/movie/:id", authMiddleware.verifyToken, movieController.getMovieById);
router.post("/movie", authMiddleware.verifyToken, movieController.createMovie);
router.put("/movie/:id", authMiddleware.verifyToken, movieController.updateMovie);
router.delete("/movie/:id", authMiddleware.verifyToken, movieController.softDeleteMovie);
router.post("/movie/upload/:id", authMiddleware.verifyToken, upload.single('harisenin_movie'), movieController.uploadImage);

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/verify-email", authController.verifyEmail);

router.get('/user',  authMiddleware.verifyToken, userController.getAllUser);
router.get('/user/:id', authMiddleware.verifyToken, userController.getUserById);
router.put('/user/:id', authMiddleware.verifyToken, userController.updateUser);
router.delete('/user/:id', authMiddleware.verifyToken, userController.softDeleteUser);
router.post("/user/upload/:id", authMiddleware.verifyToken, upload.single('harisenin_user'), userController.uploadImage);

export default router;