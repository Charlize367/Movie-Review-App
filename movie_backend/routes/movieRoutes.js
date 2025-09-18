import { Router } from "express";
import { addMovie, deleteMovie, getMovie, getMovies, updateMovie } from "../controllers/movieController.js";
import multer from 'multer';

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

movieRouter.post('/', upload.single('poster'), addMovie);

movieRouter.put('/:id', updateMovie);

movieRouter.delete('/:id', deleteMovie);

export default movieRouter;