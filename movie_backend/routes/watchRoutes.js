import { Router } from "express";
import { getLikedMovies, getLikesByMovie, getWatched, getWatchList, toggleLikeMovie, toggleWatched, toggleWatchList } from "../controllers/watchController.js";
import authorize from "../middlewares/auth.middleware.js";

const watchRouter = Router();

watchRouter.get('/liked/:userId', getLikedMovies);

watchRouter.get('/likes/movie/:movieId', getLikesByMovie);

watchRouter.get('/watchList/:userId', authorize, getWatchList);

watchRouter.get('/watched/:userId', authorize, getWatched);

watchRouter.post('/liked/:userId/:movieId', authorize, toggleLikeMovie);

watchRouter.post('/watchlist/:userId/:movieId', authorize, toggleWatchList)

watchRouter.post('/watched/:userId/:movieId', authorize, toggleWatched);

export default watchRouter;