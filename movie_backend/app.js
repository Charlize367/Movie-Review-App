import express from 'express';

import { PORT } from './config/env.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js'
import movieRouter from './routes/movieRoutes.js'
import ratingRouter from './routes/ratingRoutes.js'
import movieListRouter from './routes/movieListRoutes.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';


const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

app.use('/api/v1/movieList', movieListRouter);
app.use('/api/v1/movies', movieRouter);
app.use('/api/v1/ratings', ratingRouter);

app.use(errorMiddleware);

app.get('/', (req, res) => {
    res.send('Welcome to My Movie App!');
});

app.listen(PORT, async() => {
    console.log(`Movie App API is running on http://localhost:${PORT}`);

   await connectToDatabase();
})


export default app; 