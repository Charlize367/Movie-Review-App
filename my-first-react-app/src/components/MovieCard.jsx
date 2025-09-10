import React from "react";
import { useNavigate, Link } from 'react-router-dom';

const MovieCard = ({movie : 
    { id, title, vote_average, poster_path,  }

}) => {
    const ratings = vote_average.toFixed(1);
    return (
        <div className="movie-card">
            <Link to = {`/movie_details/${id}`}>
            <div className="indiv-movie-card">
           
                <div className="overlay">
                     
            <img className="poster" src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : null}
            />
            <div className="details">
                <div className="first-row">
                    <p className="movie_title">{title}</p>
                </div>

                <div className="second-row">
                    <div className="rating"><img className="rate-icon" src="/star.svg"/> <p className="ratings">{ratings}</p></div>
                    
                </div>
            </div>
           
        </div>
        
      
        </div>
         </Link>
        </div>
        
        
    )
}

export default MovieCard;