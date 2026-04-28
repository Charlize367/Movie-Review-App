import { notStrictEqual } from "assert";
import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getNotifications = asyncHandler(async (req, res) => {
   
        const notification = await Notification.find();

        res.status(200).json({ success: true, data: notification});
        console.log(notification);
   
});


export const getNotificationsByUser = asyncHandler(async (req, res) => {
    
        const userId = req.params.id;

        if (!userId) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get all notifications for the user, newest first
        const notifications = await Notification.find({ userId })
            .sort({ createdAt: -1 });

        res.json(notifications);
    
});
