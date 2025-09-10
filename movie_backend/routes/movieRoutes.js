import { Router } from "express";
import { addMovie, deleteMovie, getMovie, getMovies, updateMovie } from "../controllers/movieController.js";

const movieRouter = Router();

movieRouter.get('/', getMovies);

movieRouter.get('/:id', getMovie);

movieRouter.post('/', addMovie);

movieRouter.put('/:id', updateMovie);

movieRouter.delete('/:id', deleteMovie);

export default movieRouter;