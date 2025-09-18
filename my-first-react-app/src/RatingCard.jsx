import React from 'react'

import { useState, useEffect } from 'react'
import Nav from './components/Nav.jsx'
import axios from 'axios';
import emptyStar from "/star1.svg";
import halfStar from "/halfStar.svg";
import fullStar from "/star2.svg";
import { useNavigate, Link, useParams } from 'react-router-dom';

const RatingCard =  ({rating : 
    { _id, userId, rating, review, updatedAt}, tmdbId

    
}) => {
    const API_URL = 'http://localhost:3000/api/v1';
    const userID = localStorage.getItem('user_ID');
    const navigate = new useNavigate();
    const [ratingLikes, setRatingLikes] = useState([]);
    const [likedIcon, setlikedIcon] = useState("");
    const [likeFunction, setLikeFunction] = useState(() => () => {});

   

    const getRatingLikes = async () => {
       try {

     
       
             const response = await axios.get(`${API_URL}/ratings/likes/${_id}`, {
                  headers: {
                       'Content-Type': 'application/json'
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

   

     const users = userId;


const likeRating = async(e) => {
      
      e.preventDefault();

      try {

      
        const response = await axios.post(`${API_URL}/ratings/${userID}/${_id}/likes`, {
            headers : {
              'Content-Type' : 'application/json'
            }
        });

        console.log(response);
        getRatingLikes();
       

      } catch (error) {
        console.log(error);
      }
    }

const removeLike = async(e) => {
    e.preventDefault();
    
     try {
      

    
          const response = await axios.delete(`${API_URL}/ratings/${userID}/${_id}/likes`, {
                  headers: {
                       'Content-Type': 'application/json'
                  }
                });
                
                console.log(response);
               getRatingLikes();
                
                
        
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
    
     return(
                <li className="review-card">
                  {users.map(u => (
                  <div className="review-header">
                    <div className="name-group">
                    <img className="profile-ratings" src={`http://localhost:3000/${u.image}`} />
                    <p className="ratings-name">{u.username}</p>
                </div>
                <div className="rating-icon-number">
                <img className="rate-icon-ratings" src="/star.svg"/><p className="rating-number">{rating}</p>
                </div>
                  </div>
                  ))}
                <div className="review-description">
                <p>{review}</p>
                </div>

                <div className="review-details">
                  <p>{updatedAt}</p>
                  <button className="like-review" onClick={likeFunction} ><img src={`${likedIcon}`} className="ratingLikeIcon"/></button>
                  <button className="comment-review" onClick={goToComments}  ><img src={`/comment.svg`} className="commentRatingIcon"/></button>
                </div>
                </li>
           
            
            )


}

export default RatingCard;