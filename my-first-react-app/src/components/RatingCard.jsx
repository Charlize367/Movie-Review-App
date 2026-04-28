import React, { useRef } from 'react'

import { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate, Link, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"

const RatingCard =  ({rating : 
    { _id, userId, rating, review, createdAt, updatedAt}, tmdbId

    
}) => {
    const API_URL =  import.meta.env.VITE_API_URL;
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('jwtToken');
    const navigate = new useNavigate();
    const userID = localStorage.getItem('user_ID');
    const [ratingLikes, setRatingLikes] = useState([]);
    const [reviewLikeCount, setReviewLikeCount] = useState(0);
    const [reviewCommentCount, setReviewCommentCount] = useState(0);
    const isCurrentlyLiked = ratingLikes.includes(userID);
    const likedIcon = isCurrentlyLiked ? "/liked.svg" : "/like.svg"; 
    
    dayjs.extend(relativeTime);
   

    const getRatingLikes = async () => {
       try {

     
       
             const response = await axios.get(`${API_URL}/ratings/likes/${_id}`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
              });

              console.log(response);
              setRatingLikes(response.data.data.likes);
              
              
  
              
            } catch (error) {
              console.log(error);
              
            }
          }

          
  
      useEffect(() => {
      getRatingLikes();
      
    }, []);

    const getRatingLikesCount = async () => {
       try {

     
       
             const response = await axios.get(`${API_URL}/ratings/likeCount/${_id}`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
              });

              console.log(response);
              setReviewLikeCount(response.data.data);
              
              
  
              
            } catch (error) {
              console.log(error);
              
            }
          }

          
  
      useEffect(() => {
      getRatingLikesCount();
      
    }, [userID]);

    const getRatingCommentsCount = async () => {
       try {

     
       
             const response = await axios.get(`${API_URL}/ratings/commentCount/${_id}`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
              });

              console.log(response);
              setReviewCommentCount(response.data.data);
              
              
  
              
            } catch (error) {
              console.log(error);
              
            }
          }

          
  
      useEffect(() => {
      getRatingCommentsCount();
      
    }, []);


   

     const users = userId;

     console.log("Likes: ", ratingLikes);
     console.log("Like count: ", reviewLikeCount)
    const toggleLike = async(e) => {
     e.preventDefault();



      const previousLikes = [...ratingLikes];
      const previousCount = reviewLikeCount;

      const willBeLiked = !isCurrentlyLiked;

      setRatingLikes(prev =>
        willBeLiked ? [...prev, userID] : prev.filter(id => id !== userID)
      );

      setReviewLikeCount(prev => willBeLiked ? prev + 1 : prev - 1);
      

     
          try {
            
            const response = await axios.post(`${API_URL}/ratings/${userID}/${_id}/like`, {}, {
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
              }
            });

            console.log(response);
            console.log("Transaction Success:", response.data.action);

            



      } catch (error) {
       console.error("Transaction failed or timed out:", error);
    
        setRatingLikes(previousLikes);
        setReviewLikeCount(previousCount);
      }
      
    }

   

     

  const goToComments = () => {

        navigate(`/comments/${tmdbId}/${_id}`);
     

      }

  const goToLogin = () => {
    navigate("/login", {
      state: {
        from: location.pathname + location.search
      }
    })
  }
  return (
  <div className="w-full max-w-3xl mx-auto border-b border-white/10 py-6">


    <div className="flex items-center justify-between mb-3">
      {users.map(u => (
        <div key={u._id} className="flex items-center gap-3">
          <img
            src={`${API_BASE_URL}/${u.image}`}
            className="h-9 w-9 rounded-full object-cover"
            alt={u.username}
          />
          <div>
            <p className="text-sm font-medium text-white">
              {u.username}
            </p>
            <p className="text-xs text-gray-400">
              {dayjs(createdAt).fromNow()}
            </p>
          </div>
        </div>
      ))}

     
      <div className="flex items-center gap-1 text-cyan-400 text-sm">
        <img src="/star.svg" className="w-4 h-4" />
        <span className="font-medium">{rating}</span>
      </div>
    </div>

   
    <p className="text-gray-200 text-sm leading-relaxed mb-4">
      {review}
    </p>

 
    <div className="flex items-center gap-6 text-gray-400 text-sm">
      
  
      <button
        onClick={token ? toggleLike : goToLogin}
        disabled={!token}
        className="flex items-center gap-2 cursor-pointer hover:text-white transition"
      >
        <img src={likedIcon} className="w-4 h-4" />
        <span>{reviewLikeCount}</span>
      </button>

    
      <button
        onClick={goToComments}
        className="flex items-center gap-2 cursor-pointer hover:text-white transition"
      >
        <img src="/comment.svg" className="w-4 h-4" />
        <span>{reviewCommentCount}</span>
      </button>
    </div>
  </div>
);


}

export default RatingCard;