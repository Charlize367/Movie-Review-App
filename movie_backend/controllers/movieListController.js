import MovieList from '../models/movieListModel.js'
import User from '../models/userModel.js'
import asyncHandler from '../utils/asyncHandler.js'

export const getMovieList = asyncHandler(async (req, res) => {
    
            const movieList = await MovieList.find().populate('movies').populate('userId').lean();
    
            res.status(200).json({ success: true, data: movieList});
       
});

export const getMovieListById = asyncHandler(async (req, res) => {
   
        const movieList = await MovieList.findById(req.params.id).populate('movies').lean();

        if(!movieList) {
            return res.status(404).json({message : 'Movie not found'});
        }
        res.status(200).json({ success: true, data: movieList});
   
});

export const getMovieListByUser = asyncHandler(async (req, res) => {
   
        const userId = req.params.userId;
        const user = await User.findById(userId).populate('movies').lean();

        if(!user) {
            return res.status(404).json({message : 'User not found'});
        }

        const movieList = await MovieList.find({ userId : userId }).populate('movieList', ' listTitle').lean();
        res.status(200).json({ success: true, data: movieList});
    
});

export const getMovieListLikes = asyncHandler(async (req, res) => {
   

        const movieList = await MovieList.findById(req.params.id).lean();

      res.status(200).json({ success: true, data: movieList});
   
});

export const getMovieListComments = asyncHandler(async (req, res) => {
    console.log(req.params.id);
   

        const movieListComments =  await MovieList.findById(req.params.id).select('comments').populate('comments.user').lean();

        res.status(200).json({ success: true, data: movieListComments});

    
});

export const getMovieListLikeNumber = asyncHandler(async (req, res) => {
    

        const movieList = await MovieList.findById(req.params.id).lean();

        if (!movieList) {
        return res.status(404).json({ message: "List not found" });
        }

        const likeCount = movieList.likes.length;


       res.status(200).json({ success: true, data: likeCount});
    
});

export const getMovieListCommentNumber = asyncHandler(async (req, res) => {
   

        const movieList = await MovieList.findById(req.params.id).lean();

        if (!movieList) {
        return res.status(404).json({ message: "List not found" });
        }

        const commentCount = movieList.comments.length;


         res.status(200).json({
            success:true,
            message : 'Comment count fetched successfully',
            data: commentCount
        });
   
});


export const toggleMovieListLike = asyncHandler(async (req, res) => {
        const { userId, movieListId } = req.params;


        const unlikeAttempt =  await MovieList.findOneAndUpdate(
            { _id: movieListId, likes: userId },
            { $pull : { likes : userId  } },
            { new: true }
        )
            
        let action = "removed";
        
    
        if (!unlikeAttempt) {
         await MovieList.findByIdAndUpdate(
                movieListId,
                { $addToSet: { likes : userId } },
                { new: true }
            );
            action = "added";
        }
      
        res.status(201).json({
            success:true,
            action: action,
            message: `Movie List ${action}`
        })

});

export const addLikeToMovieList = asyncHandler(async (req, res) => {

        const { userId, movieListId } = req.params;

        const existingLike = await MovieList.findOne({
            _id: movieListId,
            likes: userId
        });

        if (existingLike) {
            return res.status(409).json({message : 'List already liked'});
        }

    
        const addLike = await MovieList.findById(
            movieListId,
            { $push: {likes : userId }},
            { new: true}
        )


        res.status(201).json({
            success:true,
            message: 'Liked',
            data: {
                liked : addLike
            },
            userId: userId
        })
    
});

export const addCommentToMovieList = async (req, res) => {

    

        const {comment} = req.body;
        console.log(req.params.movieId);
        
        const addComment = await MovieList.findByIdAndUpdate(
            req.params.movieListId,
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
   
}

export const removeLikeFromList = asyncHandler(async (req, res) => {
   
        const deleteLike = await MovieList.findByIdAndUpdate(
            req.params.movieListId,
            { $pull : {likes : req.params.userId  } },
        );

       if(!deleteLike) {
            return res.status(404).json({message : 'User not found'});
        }

        res.status(200).json({
            success:true,
            message : 'Like removed successfully'
        });
    
});

export const removeCommentFromList = asyncHandler(async (req, res) => {
   
        const deleteComment = await MovieList.findByIdAndUpdate(
            req.params.movieListId,
            { $pull : {comments : { _id: req.params.commentId }   } },
            
        );

       if(!deleteComment) {
            return res.status(404).json({message : 'User not found'});
        }


        res.status(200).json({
            success:true,
            message : 'Comment removed successfully'
        });
    
});

export const updateComment = asyncHandler(async (req, res) => {
   
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

         res.status(200).json({
            success:true,
            message : 'Comment updated successfully',
            data: updateComment
        });
    
});

export const createMovieList = asyncHandler(async(req, res) => {
    
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
        
});

export const updateListImage = asyncHandler(async (req, res) => {
    
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
   
});

export const addMovieToMovieList = asyncHandler(async (req, res) => {
   

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

   

});

export const updateMovieListDetails = asyncHandler(async (req, res) => {
   
     
       

        const updateMovieList = await MovieList.updateMany(
            { _id: req.params.id},
            { $set : { listTitle: req.body.listTitle, listDescription : req.body.listDescription }},
            { new : true }
        );

        if(!updateMovieList) {
            return res.status(404).json({message : 'Movie from list not found'})
        }

       res.status(200).json({
         success:true,
        message : 'Movie updated from list successfully',
        data: updateMovieList
       });
    
});

export const deleteMovieFromMovieList = asyncHandler(async (req, res) => {
    
        const deleteMovie = await MovieList.findByIdAndUpdate(
            req.params.listId,
            { $pull : {movies : req.params.movieId}},
            { new : true }
        );

        if(!deleteMovie) {
            return res.status(404).json({message : 'Movie not found'});
        }

        res.status(200).json({ success:true, message : 'Movie deleted from list successfully'});


    
});

export const deleteMovieList = asyncHandler(async (req, res) => {
   
        const movieListDelete = await MovieList.findByIdAndDelete(req.params.id);
        if(!movieListDelete) {
            return res.status(404).json({message : 'Movie not found'});
        }

        res.status(200).json({ success:true, message : 'Movie List deleted  successfully'});
    
});