import MovieList from '../models/movieListModel.js'
import User from '../models/userModel.js'

export const getMovieList = async (req, res) => {
     try {
            const movieList = await MovieList.find().populate('movies').populate('userId');
    
            res.status(200).json({ success: true, data: movieList});
        } catch (error) {
            console.log(error);
        }
}

export const getMovieListById = async (req, res) => {
    try {
        const movieList = await MovieList.findById(req.params.id).populate('movies');

        if(!movieList) {
            const error = new Error('Movie not found');
            error.statusCode(404);
            throw error;
        }
        res.status(200).json({ success: true, data: movieList});
    } catch (error) {
        console.log(error);
    }
}

export const getMovieListByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).populate('movies');

        if(!user) {
            return res.status(404).json({message : 'User not found'});
        }

        const movieList = await MovieList.find({ user : userId }).populate('movieList', ' listTitle');
        res.json(movieList);
    } catch (error) {
    console.log(error);
    }
}

export const getMovieListLikes = async (req, res) => {
    try{

        const movieList = await MovieList.findById(req.params.id).lean();

      res.status(200).json(movieList);
    } catch (error) {
     console.log(error);
    }
}

export const getMovieListComments = async (req, res) => {
    console.log(req.params.id);
    try{

        const movieListComments =  await MovieList.findById(req.params.id).select('comments').populate('comments.user');

        res.status(200).json(movieListComments);

    } catch (error) {
        console.error(error);
    }
}

export const getMovieListLikeNumber = async (req, res) => {
    try{

        const movieList = await MovieList.findById(req.params.id).lean();

        if (!movieList) {
      return res.status(404).json({ message: "List not found" });
    }

        const likeCount = movieList.likes.length;


        res.status(200).json({ likeCount});
    } catch (error) {
     console.log(error);
    }
}

export const getMovieListCommentNumber = async (req, res) => {
    try{

        const movieList = await MovieList.findById(req.params.id).lean();

        if (!movieList) {
      return res.status(404).json({ message: "List not found" });
    }

        const commentCount = movieList.comments.length;


        res.status(200).json({ commentCount});
    } catch (error) {
     console.log(error);
    }
}

export const addLikeToMovieList = async (req, res) => {

    try {
        const existingLike = await MovieList.findById(req.params.userId).findOne({'likes' : req.params.userId});

        if (existingLike) {
            const error = new Error('List already liked');
            error.statusCode = 409;
            throw error;
        }

        const movieList = await MovieList.findById(req.params.movieListId).select('_id');
        const addLike = await MovieList.findOneAndUpdate(
            { _id : movieList._id },
            { $push: {likes : [req.params.userId]}},
            { new: true}
        )


        res.status(201).json({
            success:true,
            message: 'Liked',
            data: {
                liked : addLike
            },
            userId: req.params.userId
        })
    } catch (error) {
        console.log("Failed to like list");
        console.log(error);
    }
}

export const addCommentToMovieList = async (req, res) => {

    try {

        const {comment} = req.body;
        console.log(req.params.movieId);
        const movieList = await MovieList.findById(req.params.movieListId).select('_id');
        const addComment = await MovieList.findOneAndUpdate(
            { _id : movieList._id },
            { $push: {comments : [{user: req.params.userId, comment: comment, createdAt: new Date(),
        updatedAt: new Date()}]}},
            { new: true}
        )


        res.status(201).json({
            success:true,
            message: 'Liked',
            data: {
                liked : addComment
            }
        })
    } catch (error) {
        console.log("Failed to add comment to list");
        console.log(error);
    }
}

export const removeLikeFromList = async (req, res) => {
    try {
        const deleteLike = await MovieList.findByIdAndUpdate(
            req.params.movieListId,
            { $pull : {likes : req.params.userId  } },
        );

       if(!deleteLike) {
            return res.status(404).json({message : 'User not found'});
        }

        res.status(200).json({
            message : 'Like removed successfully'
        });
    } catch (error) {
        res.status(500).json({ message : error.message, data :deleteLike });
        console.log(error);
    }
}

export const removeCommentFromList = async (req, res) => {
    try {
        const deleteComment = await MovieList.findByIdAndUpdate(
            req.params.movieListId,
            { $pull : {comments : { _id: req.params.commentId }   } },
            
        );

       if(!deleteComment) {
            return res.status(404).json({message : 'User not found'});
        }


        res.status(200).json({
            message : 'Comment removed successfully'
        });
    } catch (error) {
        res.status(500).json({ message : error.message });
        console.log(error);
    }
}

export const updateComment = async (req, res) => {
    try {
        const { movieListId, commentId } = req.params;
        const { comment } = req.body

        const updateComment = await MovieList.findByIdAndUpdate(
            movieListId,
            { 
                $set : {"comments.$[cm].comment" : comment} 
            },


            { arrayFilters: [{ "cm._id" : commentId}],
                new: true
        });
            

        if(!updateComment) {
            return res.status(404).json({message : 'Comment not found'})
        }

        res.json(updateComment)
    } catch (error) {
        console.log(error.message);
    }
}

export const createMovieList = async(req, res) => {
    try {
            let { listTitle, listDescription, movies } = req.body;
            
            if (typeof movies === "string") {
            movies = JSON.parse(movies);
        }

        console.log(req.body);
           
            const newMovieList = await MovieList.create({listTitle, listDescription, movies, userId:req.params.id, image: req.file.path});
            
            res.status(201).json({
                success:true,
                message: 'List created successfully',
                data: {
                    movieList: newMovieList,
                }
            })
        } catch (error) {
            console.log("Failed to add to Movie List");
            console.log(error);
        }
}

export const updateListImage = async (req, res) => {
    try {
        const { id } = req.params;
       if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
        }

        const updateList = await MovieList.findByIdAndUpdate(
            id,
            { image: req.file.path },
            {
        new: true,
        runValidators: true,
      }
        );

        if(!updateList) {
            return res.status(404).json({message : 'List not found'})
        }

        res.json({
      success: true,
      message: "List image updated",
      image: updateList.image,
    });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message : error.message });
    }
}

export const addMovieToMovieList = async (req, res) => {
    try {

        let { movies } = req.body;
        
        console.log(movies);
        const updatedMovieList = await MovieList.findByIdAndUpdate(
            req.params.listId,
            { $push : {
                movies: { $each: movies}
            }
            },
            { new: true}
        )

        
        res.status(201).json({
                success:true,
                message: 'Movie added to list successfully',
                data: {
                    movieList: updatedMovieList,
                }
            })

    } catch (error) {
        console.log(error);
    }

}

export const updateMovieListDetails = async (req, res) => {
    try {
     
       

        const updateMovieList = await MovieList.updateMany(
            { _id: req.params.id},
            { $set : { listTitle: req.body.listTitle, listDescription : req.body.listDescription }},
            { new : true }
        );

        if(!updateMovieList) {
            return res.status(404).json({message : 'Movie from list not found'})
        }

       res.status(200).json({
        message : 'Movie updated from list successfully',
        data: updateMovieList
       });
    } catch (error) {
        console.log(error.message);
    }
}

export const deleteMovieFromMovieList = async (req, res) => {
    try{
        const deleteMovie = await MovieList.findByIdAndUpdate(
            req.params.listId,
            { $pull : {movies : req.params.movieId}},
            { new : true }
        );

        if(!deleteMovie) {
            return res.status(404).json({message : 'Movie not found'});
        }

        res.status(200).json({message : 'Movie deleted from list successfully'});


    } catch (error) {
        console.log(error);
    }
}

export const deleteMovieList = async (req, res) => {
    try {
        const movieListDelete = await MovieList.findByIdAndDelete(req.params.id);
        if(!movieListDelete) {
            return res.status(404).json({message : 'Movie not found'});
        }

        res.status(200).json({message : 'Movie List deleted  successfully'});
    } catch (error) {
        res.status(500).json({ message : error.message });
    }
}