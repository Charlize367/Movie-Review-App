import React from 'react'
import { useState, useEffect } from 'react'
import emptyStar from "/star1.svg";
import halfStar from "/halfStar.svg";
import fullStar from "/star2.svg";
const RateMovieForm = ({ openForm }) => {

const API_URL = import.meta.env.VITE_API_URL;
const [ratings, setRatings] = useState(0);
const [review, setReview] = useState("");

const handleChange = (e) => {
  setReview(e.target.value);
};


  
const addToRating = async(e) => {
     
      e.preventDefault();
      if (!movie_ID) return;

      try{
        

        const finalData = {
          rating: ratings,
          review: review,
          userId: userId,
          movieId: movie_ID
        };


        const response = await axios.post(`${API_URL}/ratings`, finalData, {
          headers : {
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        console.log(response);

                setShowPopup(true);
                setPopupMessage("Rating added succssfully.")


         setTimeout(() => setShowPopup(false), 3000);

        openForm(!isActive);
        e.target.reset();
        getMovieRatings();
      } catch (error) {
        console.log(error);
      }
}

  return (
    <div class="w-full mx-auto max-w-md space-y-4 m-30 bg-gray-900 p-6 rounded-lg shadow-xs">

         
          <div class="flex items-center rounded-lg  pb-4 md:pb-5">
            
                <h3 class="text-xl font-semibold text-white text-heading">
                    Add your review
                </h3>
                <button type="button" onClick={openForm} class="text-body cursor-pointer bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base  text-sm w-9 h-9 ms-auto inline-flex justify-center items-center" data-modal-hide="authentication-modal">
                    <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/></svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
          <form className=" md:pt-6" onSubmit={addToRating}>
          <label className="rating-lbl">Rating:</label>
           <div style={{ display: "flex", gap: "6px", cursor: "pointer", marginBottom: "10%"}}>
  {[1, 2, 3, 4, 5].map((star) => (
    <div key={star} style={{ position: "relative", width: "32px", height: "32px" }}>
      <img
        src={
          ratings >= star
            ? fullStar
            : ratings >= star - 0.5
            ? halfStar
            : emptyStar
        }
        alt={`${star} star`}
        style={{ width: "100%", height: "100%" }}
        onClick={() => setRatings(star)}
      />
    
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "50%",
          height: "100%",
          cursor: "pointer",
        }}
        onClick={() =>
          setRatings(star - 0.5)
        }
      />
    </div>

  ))}

  
    </div>

          <label className="review-lbl">Review:</label>
          <textarea rows="6" class="p-5 rounded-lg w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800" placeholder="Add review..." name="review" value={review} onChange={handleChange} />
          <input class="block w-full cursor-pointer mt-10 mb-5 rounded-lg  bg-gradient-to-r from-blue-700 to-cyan-600 px-12 py-3 text-sm font-medium text-white transition-colors hover:bg-gradient-to-r from-blue-400 to-cyan-300 " type="submit" value="Add"/>
          </form>
    </div>
  )
}

export default RateMovieForm