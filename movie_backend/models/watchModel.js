import mongoose from "mongoose";


const watchSchema = new mongoose.Schema({
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    },
    movieId : {
        type:mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        required:true,
        
    },
    type : {
        type:String,
        enum: ['LIKED', 'WATCHLIST', 'WATCHED'],
        required:true,
        
    },
    createdAt : {
        type:Date,
        default: Date.now,
        required:true,
    },
}, {timestamps: true});

const Watch = mongoose.model('Watch', watchSchema);

export default Watch;