
import React from 'react'
import { useState, useEffect } from 'react'
import Nav from './components/Nav.jsx'
import axios from 'axios';
import emptyStar from "/star1.svg";
import halfStar from "/halfStar.svg";
import fullStar from "/star2.svg";
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"


const Rated = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('jwtToken');
  const [ratings, setRatings] = useState([]);
  const userId = localStorage.getItem('user_ID');
  const [isActive, setIsActive] = useState(false);
  const [rating, setRating] = useState(0);
  const [inputData, setInputData] = useState([]);
  const [updateID, setUpdateID] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  dayjs.extend(relativeTime);


  const openForm = (id, rate) => {
    setRating(rate);
    

    const selectedRating = ratings.find(r => r._id === id)
  console.log(rating);
    if (selectedRating) {
      setInputData({
      review: selectedRating.review,
      });
    }
    
    
    setUpdateID(id);
    setIsActive(!isActive);
}



console.log(rating);

const handleChange = (e) => {
    
  setInputData({ ...inputData, rating: rating, review: e.target.value });
   
  
  }



  const getMovieRatings = async () => {
       try {

       
             const response = await axios.get(`${API_URL}/ratings/userRatings/${userId}`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
              });

              console.log(response);
              setRatings(response.data);
              setIsLoading(false);
              
              
  
              
            } catch (error) {
              console.log(error);
              
            }
          }
  
      useEffect(() => {
      getMovieRatings();
      
    }, []);

   
    console.log(inputData.review);

  const editRatings = async(e) => {

    e.preventDefault();
    

    const finalData = {
      rating: rating,
      review: inputData.review
    }

    console.log(rating);
    try {
        const response = await axios.put(`${API_URL}/ratings/${updateID}`, finalData, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
              });

              console.log(response);

              
              setIsActive(isActive);
              e.target.reset();

              getMovieRatings();
              setIsActive(false);
              setShowPopup(true);
                setPopupMessage("Rating edited succssfully.")


         setTimeout(() => setShowPopup(false), 3000);

              } catch (error) {
              console.log(error);
              
            }
          }
  
  const deleteRating = async(id) => {

   
    try {
        const response = await axios.delete(`${API_URL}/ratings/${id}`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
              });

              console.log(response);

              
            

              getMovieRatings();
              setShowPopup(true);
                setPopupMessage("Rating deleted succssfully.")


         setTimeout(() => setShowPopup(false), 3000);

              } catch (error) {
              console.log(error);
              
            }
  }
      

    
   
  return (
    <div className="w-full">
      <Nav/>

         <h2 className="font-bold text-white text-4xl flex justify-center mb-5">All My Ratings</h2>
      
         {ratings.length == 0 && (
            <p className="text-white text-md m-10"> No ratings found.</p>
          )}
       <div>
        
        {isLoading ? (
          <center>
          <img className="spinner" src="./Spinner.svg"/>
          </center>
        ) : (
             <div className="max-w-5xl mx-auto flex flex-col gap-5">
  {ratings.map((r) => {
    const movies = r.movieId;

    return (
      <div
        key={r._id}
        className="flex gap-6 p-5 rounded-xl
        bg-gradient-to-br from-gray-800 to-blue-900
        border border-white/10"
      >

        
        <div className="flex-1">
          {movies.map(m => (
            <div key={m._id} className="mb-2">
              <h3 className="text-lg font-semibold text-white">
                {m.title}
              </h3>
            </div>
          ))}

         
          <div className="flex items-center gap-3 text-sm text-gray-300 mb-3">
            <div className="flex items-center gap-1 text-yellow-400">
              <img src="/star.svg" className="w-4 h-4" />
              <span>{r.rating}</span>
            </div>
            <span>•</span>
            <span>{dayjs(r.updatedAt).fromNow()}</span>
          </div>

          
          <p className="text-gray-200 leading-relaxed">
            {r.review}
          </p>
        </div>

        
        <div className="flex flex-col gap-3 justify-start">
          <button
            onClick={() => openForm(r._id, r.rating)}
            className="p-2 rounded-lg hover:bg-white/10 transition"
            title="Edit review"
          >
            <img src="/edit-icon.svg" className="w-5 h-5" />
          </button>

          <button
            onClick={() => deleteRating(r._id)}
            className="p-2 rounded-lg hover:bg-red-500/20 transition"
            title="Delete review"
          >
            <img src="/delete-icon.svg" className="w-5 h-5" />
          </button>
        </div>

      </div>
    );
  })}
</div>

        )}
        {showPopup && (
            <div
        className={`
          fixed top-6 right-6 z-50 max-w-xs z-99 w-full p-4 rounded-xl shadow-lg
          bg-gray-900 text-white text-sm font-medium transition-transform duration-300
          ${showPopup ? "translate-x-0 opacity-100" : "translate-x-32 opacity-0"}
        `}
      >
        {popupMessage}
      </div>
              )}

            
 {isActive && (
  <div className="fixed inset-0 z-50 flex text-white items-center justify-center p-4">
          <div class="bg-gray-900 rounded-2xl p-4 shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
                    <h2 className="text-lg font-bold text-white mb-3">Edit Review</h2>
                    
                    <form className="log-form" onSubmit={editRatings}>
                    <label className="text-white">Rating:</label>
                     <div style={{ display: "flex", gap: "6px", cursor: "pointer", marginBottom: "10%"}}>
            {[1, 2, 3, 4, 5].map((star) => (
              <div key={star} style={{ position: "relative", width: "32px", height: "32px" }} >
                <img
                  src={
                    rating >= star
                      ? fullStar
                      : rating >= star - 0.5
                      ? halfStar
                      : emptyStar
                  }
                  alt={`${star} star`}
                  style={{ width: "100%", height: "100%" }}
                  onClick={() => setRating(star)}
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
                    setRating(star - 0.5)
                  }
                />
              </div>
          
            ))}
            
            
          </div>
          
                    <label className="review-lbl">Review:</label>
                    <textarea className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3
                 text-gray-100 placeholder-gray-400
                 focus:ring-2 focus:ring-indigo-500
                 shadow-inner mb-4" col="4"  placeholder="Add review..." name="review" value={inputData.review} onChange={handleChange} />
                    
                    <div className="flex justify-end gap-3">
      <button className="text-gray-400 cursor-pointer hover:text-white" onClick={openForm}>Cancel</button>
      <button className="bg-gradient-to-r cursor-pointer from-blue-700 to-cyan-600 px-4 py-2 rounded-lg text-white">
        Save
      </button>
    </div>
                    </form>
                  </div>
                  </div>
 )}
    </div>
    </div>
  )
}

export default Rated