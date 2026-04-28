
import Movie from "../models/movieModel.js";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import asyncHandler from "../utils/asyncHandler.js";


export const getMovies = asyncHandler(async (req, res) => {
   
    const movies = await Movie.find()
        .populate({
             path: 'likedBy',
             select: 'username _id'
        })
        .lean();


    res.status(200).json({ success: true, data: movies});
   
});

export const getMovie = asyncHandler(async (req, res) => {
    
    const movie = await Movie.findById(req.params.id)
        .populate({
            path: 'likedBy',
            select: 'username _id'
        })
        .lean();

    if(!movie) {
        const error = new Error('Movie not found');
        error.statusCode(404);
        throw error;
    }
    res.status(200).json({ success: true, data: movie});
    
});


export const getMovieByTmdbId = asyncHandler(async (req, res) => {
     const tmdbId = Number(req.params.tmdbId);
   
    const movie = await Movie.findOne ({ tmdbId : tmdbId }).lean();

    if(!movie) {
        return res.status(404).json({ 
            success: false, 
            message: "Movie not found" 
        });
    }
    res.status(200).json({ success: true, data: movie});
   
});

export const getMovieLikes = asyncHandler(async (req, res) => {
    
    const movie = await Movie.findById(req.params.id).lean();

    if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
    }

    const movieLikes = movie.likedBy;
    const likeCount = movie.likedBy.length;


        res.status(200).json({ success: true, likes: movieLikes, count: likeCount});
    
});





export const addMovie = asyncHandler(async (req, res) => {
    
    const {tmdbId, title, posterPath, releaseDate, likedBy, ratings } = req.body;

    const movieExists = await Movie.findOne({ tmdbId });

    if (movieExists) {
        return res.status(200).json({ 
            success: true,
            message: "Movie already in collection, skipping add",
            exists: true,
            data: movieExists
        });
    }


    const newMovie = await Movie.create({ tmdbId, title, posterPath, releaseDate, likedBy, ratings });
    

    res.status(201).json({
        success:true,
        message: 'Movie added successfully',
        data: {
            _id: newMovie._id,     
            tmdbId: newMovie.tmdbId,
            title: newMovie.title,
            posterPath: newMovie.posterPath,
            releaseDate: newMovie.releaseDate,
            likedBy: newMovie.likedBy,
            ratings: newMovie.ratings
        },
        
        exists:false
    })
   
});

export const updateMovie = asyncHandler(async (req, res) => {
   
    const { id } = req.params;
    const updatedData = req.body

    const updateMovie = await Movie.findByIdAndUpdate(
        id,
        updatedData,
        { new : true }
    );

    if(!updateMovie) {
        return res.status(404).json({message : 'Movie not found'})
    }

    res.status(200).json({
        success: true,
        message: "Movie updated successfully",
        data: updateMovie
    });

    
});

export const deleteMovie = asyncHandler(async (req, res) => {
   
    const movieDelete = await Movie.findByIdAndDelete(req.params.id);
    if(!movieDelete) {
        return res.status(404).json({message : 'Movie not found'});
    }

    res.status(200).json({ success: true, message: 'Movie deleted successfully' });
    
});