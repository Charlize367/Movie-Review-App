
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
             <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              
              {ratings.map((r) => {
                console.log(r.userId);
                const movies = r.movieId;
                
                 
              return(
                
             
              <div class="w-80 max-w-88 space-y-4 rounded-md  bg-gradient-to-br from-gray-800 to-blue-900
 p-3 text-white transition-all duration-300 hover:-translate-y-1">
                     <div class="flex items-center justify-between">
                         <div class="flex gap-1">
                             <img className="w-6 h-6 mr-2" src="/star.svg"/><p className="text-white">{r.rating}</p>
                         </div>
                         <p>{dayjs(r.updatedAt).fromNow()}</p>
                     </div>
                     <p>{r.review}</p>
                     <div className="flex">
                     {movies.map(m => (
                     <div class="flex items-center gap-2 pt-3">
                         
                         <p class="font-medium text-white">{m.title}</p>
                       
                     </div>
                     ))}
                     <div className="flex ml-13" >
               <button className=" p-1 rounded-lg" onClick={() => {openForm(r._id, r.rating)}}><img className="w-10 h-10" src="/edit-icon.svg"/> </button>
              <button className=" p-1 rounded-lg ml-3" onClick={() => {deleteRating(r._id)}}><img className="w-10 h-10" src="/delete-icon.svg"/> </button>
             </div>
             
                 </div>
                 
                 </div>
             )})}
        
             
             
        
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
                    <input className="logBtn" type="submit" value="Edit"/>
                    <div className="flex justify-end gap-3">
      <button className="text-gray-400 hover:text-white" onClick={openForm}>Cancel</button>
      <button className="bg-gradient-to-r from-blue-700 to-cyan-600 px-4 py-2 rounded-lg text-white">
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