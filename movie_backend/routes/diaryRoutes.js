import { Router } from "express";
import { addDiaryLog, deleteLog, getLog, getLogs, updateLog } from "../controllers/diaryController.js";
import authorize from "../middlewares/auth.middleware.js";

const diaryRouter = Router();

diaryRouter.get('/', getLogs);

diaryRouter.get('/:id', authorize, getLog);

diaryRouter.get('/:id', authorize, getLog);

diaryRouter.post('/', authorize, addDiaryLog);

diaryRouter.put('/', authorize, updateLog);

diaryRouter.post('/', authorize, deleteLog);

export default diaryRouter;
