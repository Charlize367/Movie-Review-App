import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
    rating : {
        type:Number,
        required:true,
    },
    review : {
        type:String,
        required:true,
    },
    userId: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    movieId : [{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Movie"
    }]
}, {timestamps: true});

const Ratings = mongoose.model('Ratings', ratingSchema);

export default Ratings;