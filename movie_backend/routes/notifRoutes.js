
import { getNotifications, getNotificationsByUser } from "../controllers/NotifController.js";
import authorize from "../middlewares/auth.middleware.js";
import { Router } from "express";

const notifRouter = Router();

notifRouter.get('/',  getNotifications);

notifRouter.get('/:id', authorize, getNotificationsByUser);

export default notifRouter;