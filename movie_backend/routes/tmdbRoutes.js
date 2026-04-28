import { Router } from "express";
import { getCredits, getFeaturedMovies, getMovieDetails, getMovies, getMoviesByGenre } from "../controllers/tmdbController.js";


const tmdbRouter = Router();

tmdbRouter.get('/featured', getFeaturedMovies);

tmdbRouter.get('/', getMovies);

tmdbRouter.get('/genre/:categoryId', getMoviesByGenre);

tmdbRouter.get('/details/:movieId', getMovieDetails);

tmdbRouter.get('/credits/:movieId', getCredits);

tmdbRouter.get('/backdrop/:movieId', getCredits);

export default tmdbRouter;