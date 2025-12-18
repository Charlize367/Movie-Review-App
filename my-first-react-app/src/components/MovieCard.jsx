import React from "react";
import { useNavigate, Link } from 'react-router-dom';

const MovieCard = ({movie : 
    { id, title, vote_average, poster_path, posterPath, tmdbId }

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
        <div>
            <Link to = {`/movie_details/${id ?? tmdbId}`}>
            <article class="group relative overflow-hidden rounded-lg shadow-sm transition hover:shadow-lg aspect-[2/3]">
  <img alt="" src={poster ? `https://image.tmdb.org/t/p/w500/${poster}` : null} class="absolute inset-0 h-full w-full object-cover"/>


  <div
    class="
      absolute inset-0
      bg-black-600/30
      transition
      group-hover:opacity-60
    "
  ></div>
  <div class="relative
  flex flex-col justify-end h-full
    pb-6
      bg-gradient-to-t
      from-gray-900/80
      via-gray-900/40
      to-transparent
      opacity-0
      transition
      group-hover:opacity-100
      pt-32 sm:pt-48 lg:pt-64">
    <div class="p-4 sm:p-6">
      

      <a href="#">
        <h3 class="mt-0.5 text-2xl text-white"><p className="font-bold text-2xl">{title}</p></h3>
      </a>
{vote_average &&
      <div className="mt-2 flex items-center gap-1 text-sm text-white/90">
        <img src="/star.svg" className="w-4 h-4" alt="star"/>
        <span>{ratings}</span>
        </div>
}
    </div>
  </div>
</article>
</Link>
            {/* <Link to = {`/movie_details/${id}`}>
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
         </Link> */}
        </div>
        
        
    )
}

export default MovieCard;