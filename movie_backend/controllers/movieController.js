
import Movie from "../models/movieModel.js";
import mongoose from "mongoose";


export const getMovies = async (req, res) => {
    try {
        const movies = await Movie.find().populate('likedBy');

        res.status(200).json({ success: true, data: movies});
    } catch (error) {
        console.log(error);
    }
}

export const getMovie = async (req, res) => {
    try{

        const movie = await Movie.findById(req.params.id).populate('likedBy');

        if(!movie) {
            const error = new Error('Movie not found');
            error.statusCode(404);
            throw error;
        }
        res.status(200).json({ success: true, data: movie});
    } catch (error) {
     console.log(error);
    }
}





export const addMovie = async (req, res) => {
    try {
        const {tmdbId, title, posterPath, releaseDate, likedBy, ratings } = req.body;

        const movieExists = await Movie.findOne({ tmdbId });

        if(movieExists) return res.status(200).json({ message : "Movie is already in collection", exists: true, data: movieExists});

        const newMovie = await Movie.create({ tmdbId, title, posterPath, releaseDate, likedBy, ratings });
        
        const  savedMovie = await newMovie.save();

        res.status(201).json({
            success:true,
            message: 'User created successfully',
            data: savedMovie,
            exists:false
        })
    } catch (error) {
        console.log("Failed to add movie");
        console.log(error);
    }
}

export const updateMovie = async (req, res) => {
    try {
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

        res.json(updateMovie)
    } catch (error) {
        console.log(error.message);
    }
}

export const deleteMovie = async (req, res) => {
    try {
        const movieDelete = await Movie.findByIdAndDelete(req.params.id);
        if(!movieDelete) {
            return res.status(404).json({message : 'Movie not found'});
        }

        res.status(200).json({message : 'Movie deleted successfully'});
    } catch (error) {
        res.status(500).json({ message : error.message });
    }
}