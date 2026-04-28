import { Router } from "express";
import { addMovie, deleteMovie, getMovie, getMovieByTmdbId, getMovieLikes, getMovies, updateMovie } from "../controllers/movieController.js";
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

movieRouter.get('/', getMovies);

movieRouter.get('/:id', getMovie);

movieRouter.get('/:tmdbId/tmdbId', authorize, getMovieByTmdbId);

movieRouter.get('/:id/likes', authorize, getMovieLikes);

movieRouter.post('/',  upload.single('poster'), addMovie);

movieRouter.put('/:id', authorize, updateMovie);

movieRouter.delete('/:id', authorize, deleteMovie);

export default movieRouter;