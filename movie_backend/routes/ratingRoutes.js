import { Router } from "express";
import { addCommentToRating, addLiketoRating, addRating, deleteRating, getRating, getRatingCommentNumber, getRatingComments, getRatingLikeNumber, getRatingLikes, getRatings, getRatingsByMovie, getRatingsByUser, removeCommentFromRating, removeLikeFromRating, updateComment, updateRating } from "../controllers/ratingController.js";
import authorize from "../middlewares/auth.middleware.js";


const ratingRouter = Router();

ratingRouter.get('/', authorize, getRatings);

ratingRouter.get('/:id', authorize, getRating);

ratingRouter.get('/userRatings/:userId', authorize, getRatingsByUser);

ratingRouter.get('/movieRatings/:movieId', authorize, getRatingsByMovie);

ratingRouter.get('/likes/:id', authorize, getRatingLikes);

ratingRouter.get('/comments/:id', authorize, getRatingComments);

ratingRouter.get('/likeCount/:id', authorize, getRatingLikeNumber);

ratingRouter.get('/commentCount/:id', authorize, getRatingCommentNumber);

ratingRouter.post('/', addRating);

ratingRouter.post('/:userId/:ratingId/comment', authorize, addCommentToRating);

ratingRouter.post('/:userId/:ratingId/likes', authorize, addLiketoRating);

ratingRouter.put('/:id', authorize, updateRating);

ratingRouter.put('/:commentId/:ratingId/comment', authorize, updateComment);

ratingRouter.delete('/:id', authorize, deleteRating);

ratingRouter.delete('/:userId/:ratingId/likes', authorize, removeLikeFromRating);

ratingRouter.delete('/:commentId/:ratingId/comment', authorize, removeCommentFromRating);

export default ratingRouter;