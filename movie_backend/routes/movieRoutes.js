import { Router } from "express";
import { addMovie, deleteMovie, getMovie, getMovieByTmdbId, getMovieLikeNumber, getMovies, updateMovie } from "../controllers/movieController.js";
import multer from 'multer';
import authorize from "../middlewares/auth.middleware.js";

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage : storage});

const movieRouter = Router();

movieRouter.get('/', authorize, getMovies);

movieRouter.get('/:id', authorize, getMovie);

movieRouter.get('/:tmdbId/tmdbId', authorize, getMovieByTmdbId);

movieRouter.get('/:id/likeCount', authorize, getMovieLikeNumber);

movieRouter.post('/', authorize, upload.single('poster'), addMovie);

movieRouter.put('/:id', authorize, updateMovie);

movieRouter.delete('/:id', authorize, deleteMovie);

export default movieRouter;