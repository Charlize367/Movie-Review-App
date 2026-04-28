
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
    const [isLoading, setIsLoading] = useState(true);
    

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
              setIsLoading(false);
              
              
  
              
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
              <div className="max-w-4xl mx-auto flex flex-col gap-6">
            {isLoading ? (
    <div className="flex justify-center py-10">
      <img src="/Spinner.svg" />
    </div>
    ) : ratings?.length > 0 ? (
                ratings.map((r) => { 


                return(
                 <RatingCard rating={r} tmdbId = {param.id}/>
                ) 
  
                })

                ) : (
    <p className="text-center text-gray-400 mb-8">
      No reviews yet. Be the first to rate this film.
    </p>
  )}

                </div>
                </div>
                </div>
  )
}

export default AllRatings