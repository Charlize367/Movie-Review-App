import { Router } from "express";
import { addCommentToRating, addLiketoRating, addRating, deleteRating, getRating, getRatingCommentNumber, getRatingComments, getRatingLikeNumber, getRatingLikes, getRatings, getRatingsByMovie, getRatingsByUser, removeCommentFromRating, removeLikeFromRating, toggleRatingLike, updateComment, updateRating } from "../controllers/ratingController.js";
import authorize from "../middlewares/auth.middleware.js";


const ratingRouter = Router();

ratingRouter.get('/',  getRatings);

ratingRouter.get('/:id', authorize, getRating);

ratingRouter.get('/userRatings/:userId', getRatingsByUser);

ratingRouter.get('/movieRatings/:movieId', getRatingsByMovie);

ratingRouter.get('/likes/:id',  getRatingLikes);

ratingRouter.get('/comments/:id',  getRatingComments);

ratingRouter.get('/likeCount/:id',  getRatingLikeNumber);

ratingRouter.get('/commentCount/:id',  getRatingCommentNumber);

ratingRouter.post('/', addRating);

ratingRouter.post('/:userId/:ratingId/comment', authorize, addCommentToRating);

ratingRouter.post('/:userId/:ratingId/like', authorize, toggleRatingLike);

ratingRouter.put('/:id', authorize, updateRating);

ratingRouter.put('/:commentId/:ratingId/comment', authorize, updateComment);

ratingRouter.delete('/:id', authorize, deleteRating);

ratingRouter.delete('/:userId/:ratingId/likes', authorize, removeLikeFromRating);

ratingRouter.delete('/:commentId/:ratingId/comment', authorize, removeCommentFromRating);

export default ratingRouter;