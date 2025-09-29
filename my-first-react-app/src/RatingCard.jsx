import React from 'react'

import { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate, Link, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"

const RatingCard =  ({rating : 
    { _id, userId, rating, review, createdAt, updatedAt}, tmdbId

    
}) => {
    const API_URL = 'http://localhost:3000/api/v1';
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
                
                  
                  
                   
            
                    
                        <div class="testimonial-box">
                        <div class="box-top">
                            {users.map(u => (
                            <div class="profile">
                                
                                <div class="profile-img">
                                    <img className="profile-ratings" src={`http://localhost:3000/${u.image}`} />
                                </div>
                                <div class="name-user">
                                    <strong><p className="ratings-name">{u.username}</p></strong>
                                </div>
                                
                            </div>
                             ))}
                            <div class="reviews">
                            <div className="rating-icon-number">
                                <img className="rate-icon-ratings" src="/star.svg"/><p className="rating-number">{rating}</p>
                            </div>
                        </div>
                    
                        </div>

                        


                        <div class="client-comment">
                            <p>{review}</p>
                        </div>
                <div className="review-details">
                  <p>{dayjs(createdAt).fromNow()}</p>
                  
                  <button className="like-review" onClick={likeFunction} ><img src={`${likedIcon}`} className="ratingLikeIcon"/></button><p>{reviewLikeCount}</p>
                  <button className="comment-review" onClick={goToComments}  ><img src={`/comment.svg`} className="commentRatingIcon"/></button><p>{reviewCommentCount}</p>
                
                </div>
                </div>
               

                
                
               


                
                
                
                  
                  
                

                
                
                
           
            
            )


}

export default RatingCard;