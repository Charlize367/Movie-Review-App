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

        const ratings = await Ratings.find({ userId : userId }).populate('userId', 'username');
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

        const ratings = await Ratings.find({ movieId : movieId }).populate('movieId', 'title');
        res.json(ratings);
    } catch (error) {
    console.log(error);
    }
}



export const addRating = async (req, res) => {
    
    
    try {
        const {rating, review,  userId, movieId} = req.body;

       
        const newRating = await Ratings.create([{ rating, review, userId, movieId}]);

       

        res.status(201).json({
            success:true,
            message: 'User created successfully',
            data: {
                rating: newRating,
                
            }
        })
         
       
        
    } catch (error) {
        console.log("Failed to add rating", error);
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