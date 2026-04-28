import React from 'react'
import { useState } from 'react'

const MovieRatings = ({ rate, tmdbId, movie_ID, isLoading }) => {
    const recentRatings = rate.slice(0, 4);


  return (
    <div> <div>
             
  
  <div className="mt-16 text-white">
  

  <h2 className="text-4xl font-bold text-center mb-10">
    Ratings for This Film
  </h2>


  <div className="max-w-4xl mx-auto flex flex-col gap-6">
  {isLoading ? (
    <div className="flex justify-center py-10">
      <img src="/Spinner.svg" />
    </div>
  ) : rate?.length > 0 ? (
    recentRatings.map(r => (
      <RatingCard
        key={r._id}
        rating={r}
        tmdbId={tmdbId}
      />
    ))
  ) : (
    <p className="text-center text-gray-400 mb-8">
      No reviews yet. Be the first to rate this film.
    </p>
  )}
</div>

  </div>
            
           </div>

           <center>
              {recentRatings?.length > 0 && (
                <a className="mt-10 mb-10 bg-gradient-to-r from-blue-700 to-cyan-600 w-sm rounded-4xl p-5 to-blue-700 text-white"
                  style={{ display: "flex", justifyContent: "center" }} 
                  href={`/all_ratings/${movie_ID}/`}
                >
                  Check all reviews for this movie.
                </a>
              )}
            </center>
</div>
  )
}

export default MovieRatings