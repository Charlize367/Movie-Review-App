import React from 'react'

import { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate, Link, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"

const MovieListCard =  ({movieList : 
    { _id, userId, listTitle, listDescription, image, createdAt, updatedAt}

    
}) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('jwtToken');
    const userID = localStorage.getItem('user_ID');
    const navigate = new useNavigate();
    const [likeCount, setLikeCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const [likes, setLikes] = useState([]);
    const [comments, setComments] = useState([]);
    const [likedIcon, setlikedIcon] = useState("");
    const [likeFunction, setLikeFunction] = useState(() => () => {});
    
    

console.log(image);
   

   const getMovieListLikes = async () => {
       try {

     
       
             const response = await axios.get(`${API_URL}/movieList/likes/${_id}`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
              });

              console.log(response);
              setLikes(response.data.likes);
              
              
  
              
            } catch (error) {
              console.log(error);
              
            }
          }

          
  
      useEffect(() => {
      getMovieListLikes();
      
    }, []);

    const getMovieListLikeCount = async () => {
       try {

     
       
             const response = await axios.get(`${API_URL}/movieList/likeCount/${_id}`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
              });

              console.log(response);
              setLikeCount(response.data.likeCount);
              
              
  
              
            } catch (error) {
              console.log(error);
              
            }
          }

          
  
      useEffect(() => {
      getMovieListLikeCount();
      
    }, []);

    const getMovieListCommentCount = async () => {
       try {

     
       
             const response = await axios.get(`${API_URL}/movieList/commentCount/${_id}`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
              });

              console.log(response);
              setCommentCount(response.data.commentCount);
              
              
  
              
            } catch (error) {
              console.log(error);
              
            }
          }

          
  
      useEffect(() => {
      getMovieListCommentCount();
      
    }, []);


   

     const users = userId;


const likeMovieList = async(e) => {
      
      e.preventDefault();

      try {

      
        const response = await axios.post(`${API_URL}/movieList/${userID}/${_id}/likes`, {}, {
            headers : {
              'Content-Type' : 'application/json',
              'Authorization': `Bearer ${token}`
            }
        });

        console.log(response);
      
        getMovieListLikeCount();
        getMovieListLikes();
       

      } catch (error) {
        console.log(error);
      }
    }

const removeLike = async(e) => {
    e.preventDefault();
    
     try {
      

    
          const response = await axios.delete(`${API_URL}/movieList/${userID}/${_id}/likes`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
                });
                
                console.log(response);
              
               getMovieListLikeCount();
               getMovieListLikes();
                
                
        
      } catch (error) {
      console.log(error);
    }
  }

      
     




useEffect(() => {
    const selectedLike = likes.find(rl => rl.toString() === userID)
     

    if(selectedLike) {
      
      
      setlikedIcon('/liked.svg');
      setLikeFunction(() => removeLike);
      
    }
    
    
     else {
      setlikedIcon('/like.svg');
      console.log("test not liked");
      setLikeFunction(() => likeMovieList);
    
   
    }
     }, [likes]);
    
    
     

     const goToComments = () => {

        // navigate(`/comments/${tmdbId}/${_id}`);
     

      }
    

     
     return(
                
                  
                  
                   <Link to = {`/movieListPage/${_id}`}>
            
                <div >
                
<div class="w-80 max-w-88 space-y-4 rounded-md border border-gray-200 bg-white p-3 text-gray-500 transition-all duration-300 hover:-translate-y-1">
        <div class="flex justify-center ">
            <div class="flex gap-1">
                <img className="flex items-center max-w-70 m-3" src={`${API_BASE_URL}/${image}`}/>
            </div>
            
        </div>
        <p>{listTitle}</p>
        <div className="flex">
        
        <div class="flex items-center gap-2 pt-3">
            <img class="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200" alt="Richard Nelson" />
            <p class="font-medium text-gray-800">{userId.username}</p>
          
        </div>
       
        <div className="flex ml-13" >
  <div className="flex bg-gray-900 p-3 rounded-4xl"><button className="like-review" onClick={likeFunction} ><img className="w-5 h-5 mr-3" src={`${likedIcon}`} /></button><p>{likeCount}</p></div>
  <div className="flex bg-gray-900 p-3 rounded-4xl ml-10"><button className="comment-review" onClick={goToComments}  ><img className="w-5 h-5 mr-3" src={`/comment.svg`} /></button><p>{commentCount}</p></div>
</div>
    </div>
    </div>

</div>
               

                
                </Link>
               


                
                
                
                  
                  
                

                
                
                
           
            
            )


}

export default MovieListCard;