import mongoose from "mongoose";


const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // <-- each comment gets createdAt & updatedAt
);


const ratingSchema = new mongoose.Schema({
    rating : {
        type:Number,
        required:true,
    },
    review : {
        type:String,
        required:true,
    },

    likes: [
         {
                type:mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        ],
    comments: [commentSchema],

    userId: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    }],
    movieId : [{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        required:true,
    }]
}, {timestamps: true});

const Ratings = mongoose.model('Ratings', ratingSchema);

export default Ratings;