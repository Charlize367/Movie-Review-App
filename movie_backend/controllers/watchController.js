import mongoose from "mongoose";
import Watch from "../models/watchModel.js";
import Movie from "../models/movieModel.js";
import asyncHandler from "../utils/asyncHandler.js";



export const getLikedMovies = asyncHandler(async (req, res) => {

        const { userId } = req.params;
        const likedMovies = await Watch.find(
            { userId: userId, type: "LIKED"}
        )
        .populate("movieId")
        .lean();

        res.status(200).json({ success: true, data: likedMovies });

    
})


export const getLikesByMovie = asyncHandler(async (req, res) => {

        const { movieId } = req.params;
        const likesByMovie = await Watch.find(
            { movieId: movieId, type: "LIKED"}
        )
        .lean();

        res.status(200).json({ success: true, data: likesByMovie });

    
})

export const getWatchList = asyncHandler(async (req, res) => {
   
       const { userId } = req.params;
       const watchList = await Watch.find(
            { userId: userId, type: "WATCHLIST"}
        
        )
        .populate("movieId")
        .lean();

        res.status(200).json({ success: true, data: watchList });

    
})


export const getWatched = asyncHandler(async (req, res) => {
   
        const { userId } = req.params;
        const watchList = await Watch.find(
            { userId: userId, type: "WATCHLIST"}
        
        )
        .populate("movieId")
        .lean();

        res.status(200).json({ success: true, data: watchList });
    
})



export const toggleLikeMovie = asyncHandler(async (req, res) => {
    const { userId, movieId } = req.params;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
       
        const unlikeAttempt = await Watch.findOneAndDelete(
            { userId: userId, movieId: movieId, type: "LIKED" },
            {  session }
        );

        let action = "";

        if (unlikeAttempt) {
           
            await Movie.findByIdAndUpdate(
                movieId,
                { $pull: { likedBy: userId } },
                { session }
            );
            action = "like removed";

        } else {
          
           await Watch.create([{ userId: userId, movieId: movieId, type: "LIKED", createdAt: Date.now() }], { session });


            await Movie.findByIdAndUpdate(
                movieId,
                { $addToSet: { likedBy: userId } },
                { session }
            );
            action = "liked";
        }

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success: true,
            action,
            message: `Movie ${action}`
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
});

export const toggleWatchList = asyncHandler(async (req, res) => {
        const { userId, movieId } = req.params;
  
        let unlistAttempt =   await Watch.findOneAndDelete(
            { user: userId, movieId: movieId, type: "WATCHLIST" },
        );
            
        let action = "removed from";
        
    
        if (!unlistAttempt) {
            await Watch.create([{ userId: [userId], movieId: [movieId], type: "WATCHLIST", createdAt: Date.now() }]);
            action = "added to";
            
        } 
      
        res.status(201).json({
            success:true,
            action: action,
            message: `Movie ${action} list`
        })
 
});


export const toggleWatched = asyncHandler(async (req, res) => {
        const { userId, movieId } = req.params;
  
        let unwatchAttempt =   await Watch.findOneAndDelete(
            { user: userId, movieId: movieId, type: "WATCHED" },
            {  session }
        );
            
        let action = "removed from";
        
    
        if (!unwatchAttempt) {
            await Watch.create([{ userId, movieId, type: "WATCHED", createdAt: Date.now() }], { session });
            action = "added to";
            
        } 
      
        res.status(201).json({
            success:true,
            action: action,
            message: `Movie ${action} Watched`
        })
 
});