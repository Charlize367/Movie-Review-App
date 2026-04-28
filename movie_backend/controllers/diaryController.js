import Ratings from "../models/ratingModel.js";
import User from '../models/userModel.js'
import Movie from '../models/movieModel.js'
import asyncHandler from "../utils/asyncHandler.js";
import { notificationSender } from "../utils/notificationSender.js";
import Diary from "../models/diaryModel.js";


export const getLog = asyncHandler(async (req, res) => {
    
        const diaries = await Diary.find().lean();

        res.status(200).json({ success: true, data: diaries});
   
});

export const getLogs = asyncHandler(async (req, res) => {
   
        const diary = await Diary.findById(req.params.id).lean();

        if(!diary) {
            const error = new Error('Diary/Log not found');
         
            throw error;
        }
        res.status(200).json({ success: true, data: diary});
    
});

export const getLogsByUser = asyncHandler(async (req, res) => {
   
       
        const userId = req.params.userId;

        const user = await User.findById(userId).lean();

        if(!user) {
            return res.status(404).json({message : 'User not found'});
        }

        const diaries = await Diary.find({ userId : userId }).populate('userId').populate('movieId').lean();

        res.status(200).json({ success: true, data: diaries});
   
});



export const addDiaryLog = asyncHandler(async (req, res) => {

    //maybe add here logic to add also to watched
        const session = await mongoose.startSession();
        session.startTransaction();
   try {
        const {userId, movieId, watchDate, ratingId, isRewatched } = req.body;

         const movie = await Movie.findById(movieId).select('title').session(session);
         const user = await User.findById(userId).select('username friends').populate('friends', '_id').session(session);
        //  const friends = user?.friends;

         if (!movie || !user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ success: false, message: 'Movie or user not found' });
        }

     
        const newLog = await Ratings.create([{ userId, movieId, watchDate, ratingId, isRewatched }], { session });

       //SAVE FOR ACTIVITY FEED
        // const notifications = await Promise.all(friends.map(friend => 
        //     Notification.create({
        //         userId: friend._id,
        //         from: user.username,
        //         type: "RATING",
        //         message: `${user?.username} added a review on ${movie?.title}`
        //     }, { session })
        // ));

        // const wss = req.app.get("wss");
        // notifications.forEach((notification, idx) => {
        //     notificationSender(wss, friends[idx]._id, notification);
        // });


        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'Log added successfully',
            data : {
                diary : newLog,
            }
        })
     } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
     }
    
});

export const updateLog = asyncHandler(async (req, res) => {
   
        const { id } = req.params;
        const updatedData = req.body

        const updateLog = await Diary.findByIdAndUpdate(
            id,
            updatedData,
            { new : true }
        );

        if(!updateLog) {
            return res.status(404).json({message : 'Log not found'})
        }

        
         res.status(200).json({
            success:true,
            message : 'Log updated successfully',
            diary: updateLog
        });
    
});



export const deleteLog = asyncHandler(async (req, res) => {
    
        const deleteLog = await Diary.findByIdAndDelete(req.params.id);
        if(!deleteLog) {
            return res.status(404).json({message : 'Log not found'});
        }

        res.status(200).json({success: true, message : 'Log deleted successfully'});
   
});