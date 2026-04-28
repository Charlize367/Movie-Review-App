import Ratings from "../models/ratingModel.js";
import User from '../models/userModel.js'
import Movie from '../models/movieModel.js'
import asyncHandler from "../utils/asyncHandler.js";
import { notificationSender } from "../utils/notificationSender.js";


export const getRatings = asyncHandler(async (req, res) => {
    
        const ratings = await Ratings.find().lean();

        res.status(200).json({ success: true, data: ratings});
   
});

export const getRating = asyncHandler(async (req, res) => {
   
        const rating = await Ratings.findById(req.params.id).lean();

        if(!rating) {
            const error = new Error('Movie not found');
         
            throw error;
        }
        res.status(200).json({ success: true, data: rating});
    
});

export const getRatingsByUser = asyncHandler(async (req, res) => {
   
       
        const userId = req.params.userId;

        const user = await User.findById(userId).lean();

        if(!user) {
            return res.status(404).json({message : 'User not found'});
        }

        const ratings = await Ratings.find({ userId : userId }).populate('userId').populate('movieId').lean();

        res.status(200).json({ success: true, data: ratings});
   
});


export const getRatingsByMovie = asyncHandler(async (req, res) => {
   
        const movieId = req.params.movieId;
        const movie = await Movie.findById(movieId).lean();

        if(!movie) {
            return res.status(404).json({message : 'Movie not found'});
        }

        const ratings = await Ratings.find({ movieId : movieId }).populate('movieId', 'title').populate('userId').lean();
        res.status(200).json({ success: true, data: ratings});
   
});

export const getRatingLikes = asyncHandler(async (req, res) => {

   

        const likedRatings =  await Ratings.findById(req.params.id).select('likes').lean();

        res.status(200).json({ success: true, data: likedRatings});

    
});

export const getRatingComments = asyncHandler(async (req, res) => {

   

        const ratingComments =  await Ratings.findById(req.params.id).select('comments').populate('comments.userId').lean();

        res.status(200).json({ success: true, data: ratingComments});

});


export const getRatingLikeNumber = asyncHandler(async (req, res) => {
    

        const rating = await Ratings.findById(req.params.id).lean();

        if (!rating) {
        return res.status(404).json({ message: "Rating not found" });
        }

        const likeCount = rating.likes.length;


        res.status(200).json({ success: true, data: likeCount});
   
})

export const getRatingCommentNumber = asyncHandler(async (req, res) => {
    try{

        const rating = await Ratings.findById(req.params.id).lean();

        if (!rating) {
        return res.status(404).json({ message: "Rating not found" });
        }

        const commentCount = rating.comments.length;


        res.status(200).json({ success: true, data: commentCount});
    } catch (error) {
     console.log(error);
    }
})

export const addLiketoRating = asyncHandler(async (req, res) => {

   
        const existingLike = await Ratings.findOne({
            _id: req.params.ratingId,
            likes: req.params.userId
        });

        if (existingLike) {
            return res.status(409).json({ message: "Rating already liked" });
        }

       
        const addLike = await Ratings.findByIdAndUpdate(
            req.params.ratingId,
            { $push: {likes : req.params.userId}},
            { new: true}
        )


        res.status(201).json({
            success:true,
            message: 'Liked',
            data: {
                liked : addLike
            },
            userId: req.params.userId
        })
   
});


export const toggleRatingLike = asyncHandler(async (req, res) => {
        const { userId, ratingId } = req.params;

        const session = await mongoose.startSession();
        session.startTransaction();

    try {

        const unlikeAttempt =   await Ratings.findOneAndUpdate(
            { _id: ratingId, likes: userId },
            { $pull : { likes : userId  } },
            { new: true, session }
        )
            
        let action = "like removed";
        
    
        if (!unlikeAttempt) {
        const rating = await Ratings.findByIdAndUpdate(
                ratingId,
                { $addToSet: { likes : userId } },
                { new: true, session }
            );
            action = "like added";

       
        const user = await User.findById(userId);
        const movie = await Movie.findById(rating?.movieId);

       
        const notification = await Notification.create({
                    userId: rating?.userId,
                    from: userId,
                    type: "LIKED RATING",
                    message: `${user?.username} liked your rating of ${movie?.title}`
        }, session)
        
        const wss = req.app.get("wss");
        
        console.log("Triggering notification");
        notificationSender(wss, rating?.userId, notification);

        }

        res.status(201).json({
            success:true,
            action: action,
            message: `Rating ${action}`
        })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }

});

export const addCommentToRating = asyncHandler(async (req, res) => {

   

        const {comment} = req.body;

       
        const addComment = await Ratings.findByIdAndUpdate(
            req.params.ratingId,
            { $push: {comments : [{userId: req.params.userId, comment: comment, createdAt: new Date(),
        updatedAt: new Date()}]}},
            { new: true}
        )


        res.status(201).json({
            success:true,
            message: 'Liked',
            data: {
                liked : addComment
            }
        })
   
});

export const removeLikeFromRating = asyncHandler(async (req, res) => {
    
        const deleteLike = await Ratings.findByIdAndUpdate(
            req.params.ratingId,
            { $pull : {likes : req.params.userId  } },
        );

       if(!deleteLike) {
            return res.status(404).json({message : 'User not found'});
        }

        res.status(200).json({
            success:true,
            message : 'Like removed successfully'
        });
   
});

export const removeCommentFromRating = asyncHandler(async (req, res) => {
   
        const deleteComment = await Ratings.findByIdAndUpdate(
            req.params.ratingId,
            { $pull : {comments : { _id: req.params.commentId }   } },
            
        );

       if(!deleteComment) {
            return res.status(404).json({message : 'User not found'});
        }


        res.status(200).json({
            success:true,
            message : 'Comment removed successfully'
        });
   
});

export const updateComment = asyncHandler(async (req, res) => {
   
        const { ratingId, commentId } = req.params;
        const { comment } = req.body

        const updateComment = await Ratings.findByIdAndUpdate(
            ratingId,
            { 
                $set : {"comments.$[cm].comment" : comment} 
            },


            { arrayFilters: [{ "cm._id" : commentId}],
                new: true
        });
            

        if(!updateComment) {
            return res.status(404).json({message : 'Comment not found'})
        }

         res.status(200).json({
            success:true,
            message : 'Comment updated successfully',
            comment: updateComment
        });
    
});



export const addRating = asyncHandler(async (req, res) => {

        const session = await mongoose.startSession();
        session.startTransaction();
   try {
        const {rating, review, userId, movieId} = req.body;

         const movie = await Movie.findById(movieId).select('title').session(session);
         const user = await User.findById(userId).select('username friends').populate('friends', '_id').session(session);
         const friends = user?.friends;

         if (!movie || !user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ success: false, message: 'Movie or user not found' });
        }

     
        const newRating = await Ratings.create([{ rating, review, userId, movieId}], { session });

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
            message: 'Rating added successfully',
            data : {
                rating : newRating,
            }
        })
     } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
     }
    
});

export const updateRating = asyncHandler(async (req, res) => {
   
        const { id } = req.params;
        const updatedData = req.body

        const updateRating = await Ratings.findByIdAndUpdate(
            id,
            updatedData,
            { new : true }
        );

        if(!updateRating) {
            return res.status(404).json({message : 'Rating not found'})
        }

        
         res.status(200).json({
            success:true,
            message : 'Comment updated successfully',
            rating: updateRating
        });
    
});



export const deleteRating = asyncHandler(async (req, res) => {
    
        const ratingDelete = await Ratings.findByIdAndDelete(req.params.id);
        if(!ratingDelete) {
            return res.status(404).json({message : 'Rating not found'});
        }

        res.status(200).json({success: true, message : 'Rating deleted successfully'});
   
});