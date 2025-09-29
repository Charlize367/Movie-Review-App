
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
  const API_URL = 'http://localhost:3000/api/v1';
  const token = localStorage.getItem('jwtToken');
  const [ratings, setRatings] = useState([]);
  const userId = localStorage.getItem('user_ID');
  const [isActive, setIsActive] = useState(false);
  const [rating, setRating] = useState(0);
  const [inputData, setInputData] = useState([]);
  const [updateID, setUpdateID] = useState(0);

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
    <div className="container">
      <Nav/>

        <h2>My ratings</h2>
       <div id="#testimonials">
              
             <div class="testimonial-box-container">
              {ratings.map((r) => {
                console.log(r.userId);
                const movies = r.movieId;
                
                 
              return(
                
                  <div class="testimonial-box">
                  <div class="box-top">
                  {movies.map(m => (
                  <div className="my-rating-top">
                  <div class="name-user">
                    <p className="movie-rating-title">{m.title}</p>
                </div>
                <div class="reviews">
                      <div className="rating-icon-number">
                <img className="rate-icon-rated" src="/star.svg"/><p className="rating-number">{r.rating}</p>
                </div>

                </div>
                  </div>
                  ))}
                  </div>
                <div class="client-comment">
                <p>{r.review}</p>
                </div>
                

                <div className="review-details">
                   <p>{dayjs(r.updatedAt).fromNow()}</p>
                  <div className="rating-action">
                <button className="edit-rating" onClick={() => {openForm(r._id, r.rating)}}><img className="edit-icon" src="/edit-icon.svg"/> </button>
                <button className="delete-rating" onClick={() => {deleteRating(r._id)}}><img className="delete-icon" src="/delete-icon.svg"/> </button>
                </div>
                </div>
                
                
              
              </div>
             )})}
            </div>

          <div className="logForm" style={isActive ? {display: "flex"} : {display: "none"}}>
                    <h2>Log Film</h2>
                    <button className="closeBtn" onClick={openForm}>x</button>
                    <form className="log-form" onSubmit={editRatings}>
                    <label className="rating-lbl">Rating:</label>
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
                    <textarea className="review_field"  placeholder="Add review..." name="review" value={inputData.review} onChange={handleChange} />
                    <input className="logBtn" type="submit" value="Edit"/>
                    </form>
                  </div>
    </div>
    </div>
  )
}

export default Rated