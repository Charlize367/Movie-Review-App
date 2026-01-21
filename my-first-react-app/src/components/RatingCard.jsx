import React from 'react'

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
    const userID = localStorage.getItem('user_ID');
    const navigate = new useNavigate();
    const [ratingLikes, setRatingLikes] = useState([]);
    const [likedIcon, setlikedIcon] = useState("");
    const [likeFunction, setLikeFunction] = useState(() => () => {});
    const [reviewLikeCount, setReviewLikeCount] = useState(0);
    const [reviewCommentCount, setReviewCommentCount] = useState(0);

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
              setRatingLikes(response.data.likes);
              
              
  
              
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
              setReviewLikeCount(response.data.likeCount);
              
              
  
              
            } catch (error) {
              console.log(error);
              
            }
          }

          
  
      useEffect(() => {
      getRatingLikesCount();
      
    }, []);

    const getRatingCommentsCount = async () => {
       try {

     
       
             const response = await axios.get(`${API_URL}/ratings/commentCount/${_id}`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
              });

              console.log(response);
              setReviewCommentCount(response.data.commentCount);
              
              
  
              
            } catch (error) {
              console.log(error);
              
            }
          }

          
  
      useEffect(() => {
      getRatingCommentsCount();
      
    }, []);


   

     const users = userId;


const likeRating = async(e) => {
      
      e.preventDefault();

      try {

      
        const response = await axios.post(`${API_URL}/ratings/${userID}/${_id}/likes`, {}, {
            headers : {
              'Content-Type' : 'application/json',
              'Authorization': `Bearer ${token}`
            }
        });

        console.log(response);
        getRatingLikes();
        getRatingLikesCount();
       

      } catch (error) {
        console.log(error);
      }
    }

const removeLike = async(e) => {
    e.preventDefault();
    
     try {
      

    
          const response = await axios.delete(`${API_URL}/ratings/${userID}/${_id}/likes`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
                });
                
                console.log(response);
               getRatingLikes();
               getRatingLikesCount();
                
                
        
      } catch (error) {
      console.log(error);
    }
  }

      
     


     console.log(ratingLikes);

useEffect(() => {
    const selectedRatingLike = ratingLikes.find(rl => rl.toString() === userID)
     

    if(selectedRatingLike) {
      
      
      setlikedIcon('/liked.svg');
      setLikeFunction(() => removeLike);
      
    }
    
    
     else {
      setlikedIcon('/like.svg');
      console.log("test not liked");
      setLikeFunction(() => likeRating);
    
   
    }
     }, [ratingLikes]);
    
    
     console.log(likeFunction);

     const goToComments = () => {

        navigate(`/comments/${tmdbId}/${_id}`);
     

      }
    

      console.log(reviewLikeCount);
  return(
                
<div >
                
<div class="w-80 max-w-88 space-y-4 rounded-md  bg-gradient-to-br from-gray-800 to-blue-900
 p-3 text-white transition-all duration-300 hover:-translate-y-1">
        <div class="flex items-center justify-between">
            <div class="flex gap-1">
                <img className="w-6 h-6 mr-2" src="/star.svg"/><p className="text-white">{rating}</p>
            </div>
            <p>{dayjs(createdAt).fromNow()}</p>
        </div>
        <p>{review}</p>
        <div className="flex">
        {users.map(u => (
        <div class="flex items-center gap-2 pt-3">
            <img class="h-8 w-8 rounded-full" src={`${API_BASE_URL}/${u.image}`} alt="Richard Nelson" />
            <p class="font-medium text-white">{u.username}</p>
          
        </div>
        ))}
        <div className="flex ml-13 text-white" >
  <div className="flex p-3 rounded-4xl"><button className="like-review" onClick={likeFunction} ><img className="w-5 h-5 mr-3" src={`${likedIcon}`} /></button><p>{reviewLikeCount}</p></div>
  <div className="flex p-3 rounded-4xl ml-10"><button className="comment-review" onClick={goToComments}  ><img className="w-5 h-5 mr-3" src={`/comment.svg`} /></button><p>{reviewCommentCount}</p></div>
</div>
    </div>
    </div>

</div>
              
            
            )


}

export default RatingCard;