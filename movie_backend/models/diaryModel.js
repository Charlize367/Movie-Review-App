import mongoose from "mongoose";


const diarySchema = new mongoose.Schema({
    userId: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    }],
    movieId : [{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        required:true,
    }],
    watchDate : {
        type:Date,
        required:true,
    },
    ratingId : {
        type:mongoose.Schema.Types.ObjectId,
        ref: "Rating"
    },
    isRewatched : {
        type:Boolean,
        required:true,
    },
}, {timestamps: true});

const Diary = mongoose.model('Diary', diarySchema);

export default Diary;