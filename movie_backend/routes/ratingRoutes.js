import { Router } from "express";
import { addRating, deleteRating, getRating, getRatings, getRatingsByMovie, getRatingsByUser, updateRating } from "../controllers/ratingController.js";

const ratingRouter = Router();

ratingRouter.get('/', getRatings);

ratingRouter.get('/:id', getRating);

ratingRouter.get('/userRatings/:userId', getRatingsByUser);

ratingRouter.get('/movieRatings/:movieId', getRatingsByMovie);

ratingRouter.post('/', addRating);

ratingRouter.put('/:id', updateRating);

ratingRouter.delete('/:id', deleteRating);

export default ratingRouter;