import { Router } from "express";
import { addMovieToDiary, addMovietoList, addUserLikedMovies, deleteUser, getUser, getUserDiary, getUserLikedMovies, getUsers, getUserWatchList, removeMovieFromDiary, removeMovieFromLikes, removeMovieFromWatchList, updateUser } from "../controllers/userController.js";
import authorize from "../middlewares/auth.middleware.js";


const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.get('/:id', authorize, getUser);

userRouter.get('/:id/likedMovies', getUserLikedMovies);

userRouter.get('/:id/watchlist', getUserWatchList);

userRouter.get('/:id/diary', getUserDiary);

userRouter.post('/:userId/:movieId/likes', addUserLikedMovies);

userRouter.post('/:userId/:movieId/watchlist', addMovietoList);

userRouter.post('/:userId/:movieId/diary', addMovieToDiary);

userRouter.put('/:id', updateUser);

userRouter.delete('/:id', deleteUser);

userRouter.delete('/:userId/:likeId/:movieId/like', removeMovieFromLikes );

userRouter.delete('/:userId/:watchListId/watchlist', removeMovieFromWatchList )

userRouter.delete('/:userId/:diaryId/diary', removeMovieFromDiary )

export default userRouter;