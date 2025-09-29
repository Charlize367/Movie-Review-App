import { Router } from "express";
import { addMovieToDiary, addMovietoList, addUserLikedMovies, deleteUser, getUser, getUserDiary, getUserLikedMovies, getUsers, getUserWatchList, removeMovieFromDiary, removeMovieFromLikes, removeMovieFromWatchList, updateUser } from "../controllers/userController.js";
import authorize from "../middlewares/auth.middleware.js";


const userRouter = Router();

userRouter.get('/', authorize, getUsers);

userRouter.get('/:id', authorize, getUser);

userRouter.get('/:id/likedMovies', authorize, getUserLikedMovies);

userRouter.get('/:id/watchlist', authorize, getUserWatchList);

userRouter.get('/:id/diary', authorize, getUserDiary);

userRouter.post('/:userId/:movieId/likes', authorize, addUserLikedMovies);

userRouter.post('/:userId/:movieId/watchlist', authorize, addMovietoList);

userRouter.post('/:userId/:movieId/diary', authorize, addMovieToDiary);

userRouter.put('/:id', authorize, updateUser);

userRouter.delete('/:id', authorize, deleteUser);

userRouter.delete('/:userId/:likeId/:movieId/like', authorize, removeMovieFromLikes );

userRouter.delete('/:userId/:watchListId/watchlist', authorize, removeMovieFromWatchList )

userRouter.delete('/:userId/:diaryId/diary', authorize, removeMovieFromDiary )

export default userRouter;