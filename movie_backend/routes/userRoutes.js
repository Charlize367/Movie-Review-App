import { Router } from "express";
import { addMovieToDiary, addMovietoList, updateUserImage, deleteUser, getUser,  getUsers, removeMovieFromDiary, removeMovieFromLikes, removeMovieFromWatchList, updateUser,  addFollowing, getFollowers, getFollowing, removeFollowing, addLikeToMovie, toggleLikeMovie, toggleWatchList } from "../controllers/userController.js";
import authorize from "../middlewares/auth.middleware.js";
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

const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.get('/:id', getUser);

userRouter.get('/:id/followers', getFollowers);

userRouter.get('/:id/following', getFollowing);

userRouter.post('/:userId/:movieId/like', authorize, toggleLikeMovie);


userRouter.post('/:userId/:movieId/watchlist', authorize, toggleWatchList);

userRouter.post('/:userId/follower/:followingId/following', authorize, addFollowing);

userRouter.post('/:userId/:movieId/diary', authorize, addMovieToDiary);

userRouter.put('/:id', authorize, updateUser);

userRouter.put("/:id/image", upload.single("image"), authorize, updateUserImage);

userRouter.delete('/:id', authorize, deleteUser);

userRouter.delete('/:userId/:likeId/:movieId/like', authorize, removeMovieFromLikes );

userRouter.delete('/:userId/:watchListId/watchlist', authorize, removeMovieFromWatchList )

userRouter.delete('/:userId/:diaryId/diary', authorize, removeMovieFromDiary );

userRouter.delete('/:userId/follower/:followingId/following', authorize, removeFollowing);

export default userRouter;