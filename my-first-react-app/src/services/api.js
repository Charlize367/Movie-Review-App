import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem('jwtToken');


// TMDB
export const displayMovies = async (query = '') => {
    const endpoint =  query
          ? `${API_URL}/tmdb?search=${encodeURIComponent(query)}`
          : `${API_URL}/tmdb`;
   
      const { data } = await axios.get(`${endpoint}`, {
                  headers: {
                       'Content-Type': 'application/json',
                       
                  }
        });
    return data.data;

}

export const displayMoviesByCategory = async (categoryId) => {
     
    const { data } = await axios.get(`${API_URL}/tmdb/genre/${categoryId}`, {
        headers: {
            'Content-Type': 'application/json',          
        }
    });
    return data.data;
}

export const getMovieDetails = async (movieId) => {
     if (!movieId) return null;
    const { data } = await axios.get(`${API_URL}/tmdb/details/${movieId}`, {
        headers: {
            'Content-Type': 'application/json',       
        }
    });

    console.log("Details from Node:", data);
    return data.data;
}

export const getCredits = async (movieId) => {

    if (!movieId) return null;
     
    const { data } = await axios.get(`${API_URL}/tmdb/credits/${movieId}`, {
        headers: {
            'Content-Type': 'application/json',       
        }
    });

    console.log("Details from Node:", data);
    return data.data;
}


// MOVIE 
    
export const getMovieLikes = async (movieId) => {
       
    if (!movieId) return;

          
    const { data } = await axios.get(`${API_URL}/watch/likes/movie/${movieId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
       
    return data;
}


export const getUserWatchlist = async(userId) => {
    if (!userId) return;

          
    const { data } = await axios.get(`${API_URL}/watch/watchList/${userId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
       
    return data;
}


export const getMovieRatings = async(movieId) => {
    if (!movieId) return;

          
    const { data } = await axios.get(`${API_URL}/ratings/movieRatings/${movieId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
       
    return data;
}


export const toggleMovieLike = async (userId, movie_ID) => {
    console.log("HITTING MOVEI LIKE FUNCTION");

    const activeToken = localStorage.getItem('jwtToken');
    try {
        // Destructure { data } from the axios response
        const { data } = await axios.post(
            `${API_URL}/watch/liked/${userId}/${movie_ID}`, 
            {}, 
            {
                headers: { 
                    'Authorization': `Bearer ${activeToken}`,
                    'Content-Type': 'application/json' 
                }
            }
        );

        // Return the actual response from Node
        return data; 
    } catch (error) {
        // Log the error so you can see it in the console if Node crashes
        console.error("API Toggle Error:", error.response?.data || error.message);
        throw error; // Re-throw so TanStack Query knows the mutation failed
    }
};