import express from 'express';

import { PORT } from './config/env.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js'
import movieRouter from './routes/movieRoutes.js'
import ratingRouter from './routes/ratingRoutes.js'
import notifRouter from './routes/notifRoutes.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from "path"
import movieListRouter from './routes/movieListRoutes.js';
import { WebSocketServer } from 'ws';
import http from 'http'
import cookie from "cookie"
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from './config/env.js';
import watchRouter from './routes/watchRoutes.js';
import diaryRouter from './routes/diaryRoutes.js';
import tmdbRouter from './routes/tmdbRoutes.js';


const app = express();




const server = http.createServer(app);
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {


  console.log("Client connected!");
ws.send("hello server");
console.log(ws.readyState);
console.log("Connected clients:", wss.clients.size);
console.log("Cookie header:", req.headers.cookie);
  try {
    const cookies = cookie.parse(req.headers.cookie || "");

    const token = cookies.token;
    
    if(!token) {
      ws.close();
      return;

    }

    const decoded = jwt.verify(token, JWT_SECRET);

    ws.userId = decoded.userId;

    console.log(`User ${ws.userId} connected! Token is ${token}`)
  } catch (error) {

    console.log("Unauthorized websocket");
    ws.close();
}});


app.set("wss", wss);




app.get("/auth/me", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ loggedIn: false });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ loggedIn: true, user: decoded });
  } catch (err) {
    res.status(401).json({ loggedIn: false });
  }
});


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/movies', movieRouter);
app.use('/api/v1/ratings', ratingRouter);
app.use('/api/v1/movieList', movieListRouter);
app.use('/api/v1/notifications', notifRouter);
app.use('/api/v1/watch', watchRouter);
app.use('/api/v1/diary', diaryRouter);
app.use('/api/v1/tmdb', tmdbRouter);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(errorMiddleware);

app.get('/', (req, res) => {
    res.send('Welcome to My Movie App!');
});



server.listen(PORT, async() => {
    console.log(`Movie App API is running on ${PORT}`);

   await connectToDatabase();
})


export default app; 