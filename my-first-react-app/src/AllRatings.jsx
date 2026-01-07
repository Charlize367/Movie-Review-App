
import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import Nav from './components/Nav.jsx'
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"
import RatingCard from './components/RatingCard.jsx';

const AllRatings = () => {
 const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('jwtToken');
    const [ratings, setRatings] = useState([]);
    const userId = localStorage.getItem('user_ID');
    const param = useParams();
    const [reviewLikeCount, setReviewLikeCount] = useState(0);
    const [reviewCommentCount, setReviewCommentCount] = useState(0);
    const [likedIcon, setlikedIcon] = useState("");
     const [likeFunction, setLikeFunction] = useState(() => () => {});
    const [ratingLikes, setRatingLikes] = useState([]);
    

     dayjs.extend(relativeTime);


    

    const getMovieRatings = async () => {
       try {

        
       
             const response = await axios.get(`${API_URL}/ratings/movieRatings/${param.id}`, {
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


  
      


  return (
    <div className="w-full">
      <Nav/>
    <div id="#testimonials">
                <div className="testimonial-heading">
                    <h2 className="font-bold text-white text-4xl flex justify-center mb-5">All Ratings For This Film</h2>
                </div>
              <div class="m-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">

                {ratings.map((r) => { 


                return(
                 <RatingCard rating={r} tmdbId = {param.id}/>
                

                 
  ) 
  
}

                )}

                </div>
                </div>
                </div>
  )
}

export default AllRatings