import { Router } from "express";
import { addMovieToMovieList,  createMovieList,  deleteMovieFromMovieList, deleteMovieList, getMovieList, getMovieListById, getMovieListByUser, updateMovieListDetails, getMovieListLikes, getMovieListComments, getMovieListLikeNumber, getMovieListCommentNumber, addCommentToMovieList, addLikeToMovieList, removeCommentFromList, removeLikeFromList, updateComment, updateListImage } from "../controllers/movieListController.js";
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

const movieListRouter = Router();

movieListRouter.get('/',  getMovieList);

movieListRouter.get('/:id',  getMovieListById);

movieListRouter.get('/:userId',  getMovieListByUser);

movieListRouter.get('/likes/:id',  authorize, getMovieListLikes);

movieListRouter.get('/comments/:id',  getMovieListComments);

movieListRouter.get('/likeCount/:id', getMovieListLikeNumber);

movieListRouter.get('/commentCount/:id',  getMovieListCommentNumber);

movieListRouter.post('/:id', upload.single("image"), authorize, createMovieList);

movieListRouter.post('/:listId/addMovie', authorize, addMovieToMovieList);

movieListRouter.post('/:userId/:movieListId/comment', authorize, addCommentToMovieList);

movieListRouter.post('/:userId/:movieListId/likes', authorize, addLikeToMovieList);

movieListRouter.put('/:id', authorize, updateMovieListDetails);

movieListRouter.put('/:commentId/:movieListId/comment', authorize, updateComment);

movieListRouter.put("/:id/image", upload.single("image"), authorize, updateListImage);

movieListRouter.delete('/:id', authorize, deleteMovieList);

movieListRouter.delete('/:listId/:movieId/deleteMovie', authorize, deleteMovieFromMovieList);

movieListRouter.delete('/:userId/:movieListId/likes', authorize, removeLikeFromList);

movieListRouter.delete('/:commentId/:movieListId/comment', authorize, removeCommentFromList);

export default movieListRouter;