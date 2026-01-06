import User from "../models/userModel.js";
import Movie from "../models/movieModel.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";


export const getUsers = async (req, res) => {
    try {
        const users = await User.find().populate('likedMovies').populate('watchListMovies').populate('diary');

        res.status(200).json({ success: true, data: users});
    } catch (error) {
        console.log(error);
    }
}

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('likedMovies').populate('watchListMovies').populate('diary');

        if(!user) {
            const error = new Error('User not found');
            error.statusCode(404);
            throw error;
        }
        res.status(200).json({ success: true, data: user});
    } catch (error) {
        console.log(error);
    }
}


export const getUserLikedMovies = async (req, res) => {

    try{

        
        const user = await User.findById(req.params.id).select('-password');

        const userLikedMovies =  await User.findById(req.params.id).select('likedMovies').populate('likedMovies');

        res.status(200).json(userLikedMovies);

    } catch (error) {
        console.error(error);
    }
}

export const getUserWatchList = async (req, res) => {
   try{
        

        const userWatchList = await User.findById(req.params.id).select('watchListMovies').populate('watchListMovies');

        res.status(200).json(userWatchList);

    } catch (error) {
        console.error(error);
    }
}

export const getUserDiary = async (req, res) => {
   try{
    
        const userDiary = await User.findById(req.params.id).select('diary').populate('diary');

        res.status(200).json(userDiary);

    } catch (error) {
        console.error(error);
    }
}


export const addUserLikedMovies = async (req, res) => {
    
    try {
        const existingLike = await User.findOne({
  _id: req.params.userId,
  likedMovies: req.params.movieId
});

        if (existingLike) {
            const error = new Error('Movie already liked');
            error.statusCode = 409;
            throw error;
        }

        const user = await User.findById(req.params.userId).select('username');
        const addLike = await User.findOneAndUpdate(
            { username : user.username },
            { $push: {likedMovies : [req.params.movieId]}},
            { new: true}
        )

        const movie = await Movie.findById(req.params.movieId).select('title');
        const addMovieLike = await Movie.findOneAndUpdate(
            { title : movie.title },
            { $push : {likedBy : [req.params.userId]}},
            { new : true }
        )

        res.status(201).json({
            success:true,
            message: 'Liked',
            data: {
                liked : addMovieLike
            }
        })
    } catch (error) {
        console.log("Failed to add movie to likes");
        console.log(error);
    }


}

export const addMovietoList = async(req, res) => {
    try {

        const existingMovie = await User.findOne({
        _id: req.params.userId,
        watchListMovies : req.params.movieId
        });
        

        if(existingMovie) {
            const error = new Error('Movie already in list');
            error.statusCode = 409;
            throw error;
        }



        const user = await User.findById(req.params.userId).select('username');
        const addMovietoList = await User.findOneAndUpdate(
            { username : user.username },
            { $push : {watchListMovies : [req.params.movieId]}},
            { new: true}
        )


        res.json(addMovietoList);
    } catch (error) {
        console.log(error);
    }
}

export const addMovieToDiary = async(req, res) => {
    try {

        const existingMovie = await User.findOne({
        _id: req.params.userId,
        diary : req.params.movieId
        });

        if(existingMovie) {
            const error = new Error('Movie already in diary');
            error.statusCode = 409;
            throw error;
        }

        const user = await User.findById(req.params.userId).select('username');
        const addToDiary = await User.findOneAndUpdate(
            { username : user.username },
            { $push : {diary : [req.params.movieId]}},
            { new: true}
        )

        res.json(addToDiary);
    } catch (error) {
        console.log(error);
    }
}

export const updateUser = async (req, res) => {
    try {
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

        res.json({
      success: true,
      message: "User details updated",
      data: updateUser,
    });
    } catch (error) {
        console.log(error.message);
    }
}

export const updateUserImage = async (req, res) => {
    try {
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

        res.json({
      success: true,
      message: "Profile image updated",
      image: updateUser.image,
    });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message : error.message });
    }
}




export const deleteUser = async (req, res) => {
    try {
        const userDelete = await User.findByIdAndDelete(req.params.id);
        if(!userDelete) {
            return res.status(404).json({message : 'User not found'});
        }

        res.status(200).json({message : 'User deleted successfully'});
    } catch (error) {
        res.status(500).json({ message : error.message });
    }
}

export const removeMovieFromLikes = async (req, res) => {
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

        res.status(200).json({
            message : 'Movie removed from likes successfully'
        });
    } catch (error) {
        res.status(500).json({ message : error.message });
        console.log(error);
    }
}

export const removeMovieFromWatchList = async (req, res) => {
    try {
        const deleteMovie = await User.findByIdAndUpdate(
            req.params.userId,
            { $pull : {watchListMovies : req.params.watchListId }},
            { new: true }
        );

       if(!deleteMovie) {
            return res.status(404).json({message : 'User not found'});
        }

        res.status(200).json({message : 'Movie removed from WatchList successfully'});
    } catch (error) {
        res.status(500).json({ message : error.message });
    }
}

export const removeMovieFromDiary = async (req, res) => {
    try {
        const deleteMovie = await User.findByIdAndUpdate(
            req.params.userId,
            { $pull : {diary : req.params.diaryId }},
            { new: true }
        );

       if(!deleteMovie) {
            return res.status(404).json({message : 'User not found'});
        }

        res.status(200).json({message : 'Movie removed from Diary successfully'});
    } catch (error) {
        res.status(500).json({ message : error.message });
    }
}

