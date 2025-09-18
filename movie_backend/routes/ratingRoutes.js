import { Router } from "express";
import { addCommentToRating, addLiketoRating, addRating, deleteRating, getRating, getRatingComments, getRatingLikes, getRatings, getRatingsByMovie, getRatingsByUser, removeCommentFromRating, removeLikeFromRating, updateComment, updateRating } from "../controllers/ratingController.js";

const ratingRouter = Router();

ratingRouter.get('/', getRatings);

ratingRouter.get('/:id', getRating);

ratingRouter.get('/userRatings/:userId', getRatingsByUser);

ratingRouter.get('/movieRatings/:movieId', getRatingsByMovie);

ratingRouter.get('/likes/:id', getRatingLikes);

ratingRouter.get('/comments/:id', getRatingComments);

ratingRouter.post('/', addRating);

ratingRouter.post('/:userId/:ratingId/comment', addCommentToRating);

ratingRouter.post('/:userId/:ratingId/likes', addLiketoRating);

ratingRouter.put('/:id', updateRating);

ratingRouter.put('/:commentId/:ratingId/comment', updateComment);

ratingRouter.delete('/:id', deleteRating);

ratingRouter.delete('/:userId/:ratingId/likes', removeLikeFromRating);

ratingRouter.delete('/:commentId/:ratingId/comment', removeCommentFromRating);

export default ratingRouter;