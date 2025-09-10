import React from "react";

const Hero = ({trendingMovie : 
    { title,  poster_path, release_date, original_language, vote_average, overview}

}) => {
    const release_year =  release_date.substring(0, 4);
    const ratings = vote_average.toFixed(1);
    return (
         <div className="hero">
            <img className="poster" src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : null}
            />

            <div className="details">
                <div className="row-one">
                    <p>{ratings}</p>
                    <p>{release_year}</p>
                    <p>{original_language}</p>
                </div>

                <div className="row-two">
                    <p>{title}</p>
                </div>

                <div className="row-three">
                    <p>{overview}</p>
                </div>
            </div>
        </div>
    )
}

export default Hero;