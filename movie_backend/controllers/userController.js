import User from "../models/userModel.js";
import Movie from "../models/movieModel.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Notification from "../models/notificationModel.js";
import { notificationSender } from "../utils/notificationSender.js";
import asyncHandler from '../utils/asyncHandler.js'


export const getUsers = asyncHandler(async (req, res) => {
    
        const users = await User.find().populate('likedMovies').populate('watchListMovies').populate('diary').lean();

        res.status(200).json({ success: true, data: users});
    
});

export const getUser = asyncHandler(async (req, res) => {
    
        const user = await User.findById(req.params.id).populate('likedMovies').populate('watchListMovies').populate('diary').lean();

        if(!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user});
    
});




export const getFollowers = asyncHandler(async (req, res) => {
   
    
        const followers = await User
        .findById(req.params.id)
        .select('followers')
        .populate({
            path: 'followers',
            select: 'username _id image'
        })
        .lean();

        const followersCount = followers.followers.length;
        res.status(200).json({ success: true, followers: followers, count: followersCount });

       

   
});

export const getFollowing = asyncHandler(async (req, res) => {
   
    
        const following = await User
        .findById(req.params.id)
        .select('following')
        .populate({
            path: 'following',
            select: 'username _id image'
        })
        .lean();

        const followingCount = following.following.length;
        res.status(200).json({ success: true, following: following, count: followingCount });

    
});


export const toggleLikeMovie = asyncHandler(async (req, res) => {
    const { userId, movieId } = req.params;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
       
        const unlikeAttempt = await User.findOneAndUpdate(
            { _id: userId, likedMovies: movieId },
            { $pull: { likedMovies: movieId } },
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
          
            await User.findByIdAndUpdate(
                userId,
                { $addToSet: { likedMovies: movieId } },
                { session }
            );

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
  
        let unlistAttempt =   await User.findOneAndUpdate(
            { _id: userId, watchListMovies: movieId },
            { $pull : {watchListMovies : movieId  } },
            )
            
        let action = "removed from";
        
    
        if (!unlistAttempt) {
            await User.findByIdAndUpdate(
                userId,
                { $addToSet: { watchListMovies: movieId } },
            );
            action = "added to";
            
        } 
      
        res.status(201).json({
            success:true,
            action: action,
            message: `Movie ${action} list`
        })
 
});



export const addLikeToMovie = asyncHandler(async (req, res) => {
    
    
        const session = await mongoose.startSession();
        session.startTransaction();
    try {
        const movie = await Movie.findById(req.params.movieId).select('title').session(session);
        const user = await User.findById(req.params.userId).select('username friends').populate('friends', '_id').session(session);
        const friends = user?.friends;

        if (!movie || !user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ success: false, message: 'Movie or user not found' });
        }

        
    
        const existingLike = await User.findOne({
        _id: req.params.userId,
        likedMovies: req.params.movieId
        });

        if (existingLike) {
            await session.abortTransaction();
            session.endSession();
            return res.status(409).json({ success: false, message: 'Movie already liked' });
        }

        
        const addLike = await User.findByIdAndUpdate(
            req.params.userId,
            { $addToSet: {likedMovies : [req.params.movieId]}},
            { new: true, session}
        )

       
        const addMovieLike = await Movie.findByIdAndUpdate(
            req.params.movieId,
            { $addToSet : {likedBy : [req.params.userId]}},
            { new : true, session }
        )

        // const notifications = await Promise.all(friends.map(friend => 
        //     Notification.create({
        //         userId: friend._id,
        //         from: user.username,
        //         type: "LIKE",
        //         message: `${user?.username} liked ${movie?.title}`
        //     }, { session })
        // ));

        // const wss = req.app.get("wss");
        // notifications.forEach((notification, idx) => {
        //     notificationSender(wss, friends[idx]._id, notification);
        // });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success:true,
            message: 'Liked',
            data: {
                liked : addMovieLike,
                user: addLike
            }
        })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
    


});

export const addMovietoList = asyncHandler(async(req, res) => {
    

        const existingMovie = await User.findOne({
        _id: req.params.userId,
        watchListMovies : req.params.movieId
        });
        

        if(existingMovie) {
            return res.status(409).json({ success: false, message: 'Movie already in list' });
        }



       
        const addMovietoList = await User.findByIdAndUpdate(
            req.params.userId,
            { $addToSet : {watchListMovies : [req.params.movieId]}},
            { new: true}
        )


        res.status(201).json({
            success:true,
            message: 'Added to list',
            data: {
                list : addMovietoList
            }
        });
   
});

export const addMovieToDiary = asyncHandler(async(req, res) => {
    

        const existingMovie = await User.findOne({
        _id: req.params.userId,
        diary : req.params.movieId
        });

        if(existingMovie) {
            return res.status(409).json({ success: false, message: 'Movie already in diary' });
        }

       
        const addToDiary = await User.findByIdAndUpdate(
            req.params.userId,
            { $addToSet : {diary : [req.params.movieId]}},
            { new: true}
        )

        res.status(201).json({
            success:true,
            message: 'Added to diary',
            data: {
                diary : addToDiary
            }
        });
    
});

export const addFollowing = asyncHandler(async(req, res) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const { userId, followingId } = req.params;

        if(userId === followingId) {
            return res.status(400).json({ success: false, message: 'You cannot follow yourself' });
        }

        const followingExists = await User.findOne({
        _id: userId,
        following: followingId 
        });

        if(followingExists) {
            return res.status(409).json({ success: false, message: 'User already followed' });
        }

         await User.findByIdAndUpdate(
            userId,
            { $addToSet : {following : followingId}},
            
        )

      await User.findByIdAndUpdate(followingId, {
        $addToSet: { followers: userId }
      });

    


        const followingMutual = await User.findOne({
        _id: followingId,
        following : userId
        });

        if(followingMutual) {
              await User.findByIdAndUpdate(
                userId,
                { $addToSet: { friends: followingId } }
            );

             await User.findByIdAndUpdate(
                followingId,
                { $addToSet : {friends : userId}},
                { new: true}
            )

             
        }

        const user = await User.findById(userId);
        console.log("Username :", user?.username, "User ID: ", userId);

        const notification = await Notification.create({
            userId: followingId,
            from: userId,
            type: "FOLLOW",
            message: `${user?.username} followed you`
        })

        const wss = req.app.get("wss");

        console.log("Triggering notification");
        notificationSender(wss, followingId, notification);

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success:true,
            message: "Followed successfully",
            mutualFriend: !!followingMutual
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw err;
    }
        
        

    
});


export const removeFollowing = asyncHandler(async(req, res) => {
    
    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const { userId, followingId } = req.params;

        if(userId === followingId) {
            return res.status(400).json({ message: "You cannot unfollow yourself" });
        }

        const followingExists = await User.findOne({
        _id: userId,
        following: followingId 
        });

        if(!followingExists) {
            return res.status(409).json({ success: false, message: 'User already unfollowed' });
        }

         await User.findByIdAndUpdate(
            userId,
            { $pull : {following : followingId}},
            
        )

      await User.findByIdAndUpdate(followingId, {
        $pull: { followers: userId }
      });

    


        const followingMutual = await User.findOne({
        _id: followingId,
        following : userId
        });

        if(followingMutual) {
              await User.findByIdAndUpdate(
                userId,
                { $pull: { friends: followingId } }
            );

             await User.findByIdAndUpdate(
                followingId,
                { $pull : {friends : userId}},
                { new: true}
            )

             
        }

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success:true,
            message: "Unfollowed successfully",
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw err;
    }
        
        

    
});


export const updateUser = asyncHandler(async (req, res) => {
    
        const { id } = req.params;
        const { username, email, password} = req.body;
        const updateData = {};

    if (username) updateData.username = username;
    if (email) updateData.email = email;

    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }


        const updateUser = await User.findByIdAndUpdate(
            id,
            updateData,
            {
        new: true,
        runValidators: true,
      }
        );

        if(!updateUser) {
            return res.status(404).json({message : 'User not found'})
        }

    return res.status(200).json({
      success: true,
      message: "User details updated",
      data: updateUser,
    });
   
});

export const updateUserImage = asyncHandler(async (req, res) => {
    
        const { id } = req.params;
       if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
        }

        const updateUser = await User.findByIdAndUpdate(
            id,
            { image: req.file.path },
            {
        new: true,
        runValidators: true,
      }
        );

        if(!updateUser) {
            return res.status(404).json({message : 'User not found'})
        }

        res.status(200).json({
      success: true,
      message: "Profile image updated",
      image: updateUser.image,
    });
   
});




export const deleteUser = asyncHandler(async (req, res) => {
    
        const userDelete = await User.findByIdAndDelete(req.params.id);
        if(!userDelete) {
            return res.status(404).json({message : 'User not found'});
        }

        res.status(200).json({success:true, message : 'User deleted successfully'});
   
});

export const removeMovieFromLikes = asyncHandler(async (req, res) => {

   const session = await mongoose.startSession();
   session.startTransaction();

   try {
        const deleteMovie = await User.findByIdAndUpdate(
            req.params.userId,
            { $pull : {likedMovies : req.params.likeId  } },
            { new: true }
        );

       if(!deleteMovie) {
            return res.status(404).json({message : 'User not found'});
        }

       
        const removeFromMovie = await Movie.findByIdAndUpdate(
            req.params.movieId,
            { $pull : {likedBy : req.params.userId} }
        )

         if(!removeFromMovie) {
            return res.status(404).json({message : 'Movie not found'});
        }

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success:true,
            message : 'Movie removed from likes successfully'
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw err;
    }
   
});

export const removeMovieFromWatchList = asyncHandler(async (req, res) => {
    
        const deleteMovie = await User.findByIdAndUpdate(
            req.params.userId,
            { $pull : {watchListMovies : req.params.watchListId }},
            { new: true }
        );

       if(!deleteMovie) {
            return res.status(404).json({message : 'User not found'});
        }

        res.status(200).json({success:true, message : 'Movie removed from WatchList successfully'});
    
});

export const removeMovieFromDiary = asyncHandler(async (req, res) => {
    
        const deleteMovie = await User.findByIdAndUpdate(
            req.params.userId,
            { $pull : {diary : req.params.diaryId }},
            { new: true }
        );

       if(!deleteMovie) {
            return res.status(404).json({message : 'User not found'});
        }

        res.status(200).json({success:true, message : 'Movie removed from Diary successfully'});
   
});



//FOR ACTIVITY FEED
//     const notifications = await Promise.all(friends.map(friend => 
        //     Notification.create({
        //         userId: friend._id,
        //         from: user.username,
        //         type: "LIKE",
        //         message: `${user?.username} liked ${movie?.title}`
        //     }, { session })
        // ));

        // const wss = req.app.get("wss");
        // notifications.forEach((notification, idx) => {
        //     notificationSender(wss, friends[idx]._id, notification);
        // });