import React from "react";
import { useNavigate, Link } from 'react-router-dom';

const MovieCard = ({movie : 
    { id, title, vote_average, poster_path, posterPath  }

}) => {
    let ratings = 0;

    if (!vote_average) {
        ratings = null;
    } else {
        ratings = vote_average.toFixed(1);
    }


    let poster ="";
    if (!poster_path) {
        poster = posterPath
    } else {
        poster = poster_path;
    }

   
    console.log(poster);

    return (
        <div className="movie-card">
            
            <Link to = {`/movie_details/${id}`}>
            <div className="indiv-movie-card">
           
                <div className="overlay">
                     
            <img className="poster" src={poster ? `https://image.tmdb.org/t/p/w500/${poster}` : null}
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