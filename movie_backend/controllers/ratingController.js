import Ratings from "../models/ratingModel.js";
import User from '../models/userModel.js'
import Movie from '../models/movieModel.js'



export const getRatings = async (req, res) => {
    
    try {
        const ratings = await Ratings.find();

        res.status(200).json({ success: true, data: ratings});
    } catch (error) {
        next(error);
    }
}

export const getRating = async (req, res) => {
    try {
        const rating = await Ratings.findById(req.params.id);

        if(!rating) {
            const error = new Error('Movie not found');
         
            throw error;
        }
        res.status(200).json({ success: true, data: rating});
    } catch (error) {
        console.log(error);
    }
}

export const getRatingsByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if(!user) {
            return res.status(404).json({message : 'User not found'});
        }

        const ratings = await Ratings.find({ userId : userId }).populate('userId').populate('movieId');
        res.json(ratings);
    } catch (error) {
    console.log(error);
    }
}


export const getRatingsByMovie = async (req, res) => {
    try {
        const movieId = req.params.movieId;
        const movie = await Movie.findById(movieId);

        if(!movie) {
            return res.status(404).json({message : 'Movie not found'});
        }

        const ratings = await Ratings.find({ movieId : movieId }).populate('movieId', 'title').populate('userId');
        res.json(ratings);
    } catch (error) {
    console.log(error);
    }
}

export const getRatingLikes = async (req, res) => {

    try{

        const likedRatings =  await Ratings.findById(req.params.id).select('likes');

        res.status(200).json(likedRatings);

    } catch (error) {
        console.error(error);
    }
}

export const getRatingComments = async (req, res) => {

    try{

        const ratingComments =  await Ratings.findById(req.params.id).select('comments').populate('comments.userId');

        res.status(200).json(ratingComments);

    } catch (error) {
        console.error(error);
    }
}


export const addLiketoRating = async (req, res) => {

    try {
        const existingLike = await Ratings.findOne({'likes' : req.params.userId});

        if (existingLike) {
            const error = new Error('Rating already liked');
            error.statusCode = 409;
            throw error;
        }

        const rating = await Ratings.findById(req.params.ratingId).select('_id');
        const addLike = await Ratings.findOneAndUpdate(
            { _id : rating._id },
            { $push: {likes : [req.params.userId]}},
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
    } catch (error) {
        console.log("Failed to like rating");
        console.log(error);
    }
}

export const addCommentToRating = async (req, res) => {

    try {

        const {comment} = req.body;

        const rating = await Ratings.findById(req.params.ratingId).select('_id');
        const addComment = await Ratings.findOneAndUpdate(
            { _id : rating._id },
            { $push: {comments : [{userId: req.params.userId, comment: comment}]}},
            { new: true}
        )


        res.status(201).json({
            success:true,
            message: 'Liked',
            data: {
                liked : addComment
            }
        })
    } catch (error) {
        console.log("Failed to add comment to rating");
        console.log(error);
    }
}

export const removeLikeFromRating = async (req, res) => {
    try {
        const deleteLike = await Ratings.findByIdAndUpdate(
            req.params.ratingId,
            { $pull : {likes : req.params.userId  } },
        );

       if(!deleteLike) {
            return res.status(404).json({message : 'User not found'});
        }

       


        res.status(200).json({
            message : 'Like removed successfully'
        });
    } catch (error) {
        res.status(500).json({ message : error.message, data :deleteLike });
        console.log(error);
    }
}

export const removeCommentFromRating = async (req, res) => {
    try {
        const deleteComment = await Ratings.findByIdAndUpdate(
            req.params.ratingId,
            { $pull : {comments : { _id: req.params.commentId }   } },
            
        );

       if(!deleteComment) {
            return res.status(404).json({message : 'User not found'});
        }


        res.status(200).json({
            message : 'Comment removed successfully'
        });
    } catch (error) {
        res.status(500).json({ message : error.message });
        console.log(error);
    }
}

export const updateComment = async (req, res) => {
    try {
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

        res.json(updateComment)
    } catch (error) {
        console.log(error.message);
    }
}



export const addRating = async (req, res) => {
    
    try {
        const {rating, review, userId, movieId} = req.body;

        const newRating = await Ratings.create([{ rating, review, userId, movieId}]);

        res.status(201).json({
            success: true,
            message: 'Rating added successfully',
            data : {
                rating : newRating,
            }
        })
    } catch (error) {
        console.log(error);
        console.log('Failed to add rating');
    }
}


   


export const updateRating = async (req, res) => {
    try {
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

        res.json(updateRating)
    } catch (error) {
        console.log(error.message);
    }
}



export const deleteRating = async (req, res) => {
    try {
        const ratingDelete = await Ratings.findByIdAndDelete(req.params.id);
        if(!ratingDelete) {
            return res.status(404).json({message : 'Rating not found'});
        }

        res.status(200).json({message : 'Rating deleted successfully'});
    } catch (error) {
        res.status(500).json({ message : error.message });
    }
}