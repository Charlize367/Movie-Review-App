import mongoose from 'mongoose'

const movieSchema = new mongoose.Schema({
    tmdbId: {
        type:Number,
        required:[true, 'Movie ID from TMDB is required'],
    },
    title: {
        type:String,
        required:[true, 'Movie Title is required'],
    },
    posterPath : {
        type:String,
        required:[true, 'PosterPath is required'],
    },
    releaseDate: {
        type:Date,
        required: [true, 'Date is required'],
    },
    likedBy: [
        {
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],

}, {timestamps: true});

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;