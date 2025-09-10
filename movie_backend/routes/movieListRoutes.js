import { Router } from "express";
import { addMovieToMovieList,  createMovieList,  deleteMovieFromMovieList, deleteMovieList, getMovieList, getMovieListById, getMovieListByUser, updateMovieListDetails } from "../controllers/movieListController.js";


const movieListRouter = Router();

movieListRouter.get('/', getMovieList);

movieListRouter.get('/:id', getMovieListById);

movieListRouter.get('/:userId', getMovieListByUser);

movieListRouter.post('/', createMovieList);

movieListRouter.post('/:listId/:movieId/', addMovieToMovieList);

movieListRouter.put('/:id', updateMovieListDetails);

movieListRouter.delete('/:id', deleteMovieList);

movieListRouter.delete('/:listId/:movieId/', deleteMovieFromMovieList);

export default movieListRouter;