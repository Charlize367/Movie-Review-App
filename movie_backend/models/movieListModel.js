import mongoose from "mongoose";

const movieListSchema = new mongoose.Schema(
    [ {
        listTitle : {type:String, required:true},
        listDescription: {type:String, required:true},
        likes: [
                 {
                        type:mongoose.Schema.Types.ObjectId,
                        ref: "User",
                    }
                ],
            comments: [{
                user: {type: String, required:true},
                comment: {type:String, required: true}
            }],
        movies : [{type: mongoose.Schema.Types.ObjectId,ref: "Movie"}],
        userId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
    }
}]
);

const MovieList = mongoose.model('MovieList', movieListSchema);

export default MovieList;