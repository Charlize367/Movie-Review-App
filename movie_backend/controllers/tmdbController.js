import asyncHandler from "../utils/asyncHandler.js";
import axios from "axios"


import { TMDB_API_KEY, TMDB_API_URL } from '../config/env.js'


export const getFeaturedMovies = asyncHandler(async (req, res, next) => {
    const response = await axios.get(`${TMDB_API_URL}/trending/movie/day?language=en-US`, {
                  headers : {
                    accept: 'application/json',
                    Authorization: `Bearer ${TMDB_API_KEY}`
                }
              });

    res.status(200).json({
            success:true,
            message: 'Featured movies fetched successfully',
            data: response.data.results 
    })
})


export const getMovies = asyncHandler(async (req, res, next) => {

    const query = req.query.search;
    const endpoint =  query
      ? `${TMDB_API_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${TMDB_API_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`;

    const response = await axios.get(endpoint, {
                  headers : {
                    accept: 'application/json',
                    Authorization: `Bearer ${TMDB_API_KEY}`
                }
            });

    console.log(response);
    res.status(200).json({
            success:true,
            message: 'Movies fetched successfully',
            data: response.data.results 
    })
})

export const getMoviesByGenre = asyncHandler(async (req, res, next) => {
    const categoryId = req.params.categoryId;

    const response = await axios.get(`${TMDB_API_URL}/discover/movie?with_genres=${categoryId}&include_adult=false&include_video=false&language=en-US&page=1&sort_bypopularity.desc`, {
                  headers : {
                        accept: 'application/json',
                        Authorization: `Bearer ${TMDB_API_KEY}`
                    }
              });

    res.status(200).json({
            success:true,
            message: `Movies of Genre ID ${categoryId} fetched successfully`,
            data: response.data.results 
    })
});


export const getMovieDetails = asyncHandler(async (req, res, next) => {

    const movieId = req.params.movieId;

    const response = await axios.get(`${TMDB_API_URL}/movie/${movieId}`, {
                  headers : {
                        accept: 'application/json',
                        Authorization: `Bearer ${TMDB_API_KEY}`
                    }
    });

    res.status(200).json({
            success:true,
            message: `Movie Details of Movie ID ${movieId} fetched successfully`,
            data: response.data 
    })
});


export const getCredits = asyncHandler(async (req, res, next) => {

    const movieId = req.params.movieId;


    const response = await axios.get(`${TMDB_API_URL}/movie/${movieId}/credits`, {
                  headers : {
                        accept: 'application/json',
                        Authorization: `Bearer ${TMDB_API_KEY}`
                    }
    });

    res.status(200).json({
            success:true,
            message: `Credits of Movie ID ${movieId} fetched successfully`,
            data: response.data
    })
});


export const getBackdrop = asyncHandler(async (req, res, next) => {

    const movieId = req.params.movieId;

    const response = await axios.get(`${TMDB_API_URL}/movie/${movieId}/images`, {
                  headers : {
                        accept: 'application/json',
                        Authorization: `Bearer ${TMDB_API_KEY}`
                    }
    });

    res.status(200).json({
            success:true,
            message: `Backdrop of Movie ID ${movieId} fetched successfully`,
            data: response.data
    })
});