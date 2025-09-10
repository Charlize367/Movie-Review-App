import MovieList from '../models/movieListModel.js'
import User from '../models/userModel.js'

export const getMovieList = async (req, res) => {
     try {
            const movieList = await MovieList.find().populate('movies');
    
            res.status(200).json({ success: true, data: movieList});
        } catch (error) {
            next(error);
        }
}

export const getMovieListById = async (req, res) => {
    try {
        const movieList = await MovieList.findById(req.params.id);

        if(!movieList) {
            const error = new Error('Movie not found');
            error.statusCode(404);
            throw error;
        }
        res.status(200).json({ success: true, data: movieList});
    } catch (error) {
        next(error);
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

export const createMovieList = async(req, res) => {
    try {
            const [{listTitle, listDescription, movies, userId}] = req.body;
    
           
            const newMovieList = await MovieList.create([{listTitle, listDescription, movies, userId}]);
            
            res.status(201).json({
                success:true,
                message: 'User created successfully',
                data: {
                    movieList: newMovieList[0],
                }
            })
        } catch (error) {
            console.log("Failed to add to Movie List");
            console.log(error);
        }
}

export const addMovieToMovieList = async (req, res) => {
    try {

        
        const updatedMovieList = await MovieList.findByIdAndUpdate(
            req.params.listId,
            { $push : {movies : req.params.movieId}},
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