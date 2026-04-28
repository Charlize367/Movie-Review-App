import React, { useRef } from 'react'

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
    const [likeCount, setLikeCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const [likes, setLikes] = useState([]);
    const isCurrentlyLiked = likes.includes(userID);
    const likedIcon = isCurrentlyLiked ? "/liked.svg" : "/like.svg"; 
    
  


   const getMovieListLikes = async () => {
       try {

     
       
             const response = await axios.get(`${API_URL}/movieList/likes/${_id}`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
              });

              console.log(response);
              setLikes(response.data.data.likes);
              
              
  
              
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
              setLikeCount(response.data.data);
              
              
  
              
            } catch (error) {
              console.log(error);
              
            }
          }

          
  
      useEffect(() => {
      getMovieListLikeCount();
      
    }, []);

    console.log("Like count: ", likeCount);
    console.log("Likes: ", likes);

    const getMovieListCommentCount = async () => {
       try {

     
       
             const response = await axios.get(`${API_URL}/movieList/commentCount/${_id}`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
              });

              console.log(response);
              setCommentCount(response.data.data);
              
              
  
              
            } catch (error) {
              console.log(error);
              
            }
          }

          
  
      useEffect(() => {
      getMovieListCommentCount();
      
    }, []);


     const toggleLike = async (e) => {
  e.preventDefault();

      const previousLikes = [...likes];
      const previousCount = likeCount;

      const willBeLiked = !isCurrentlyLiked;

      setLikes(prev =>
        willBeLiked ? [...prev, userID] : prev.filter(id => id !== userID)
      );

      setLikeCount(prev => willBeLiked ? prev + 1 : prev - 1);

  try {
            
        const response = await axios.post(`${API_URL}/movieList/${userID}/${_id}/likes`, {}, {
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
              }
            });

            console.log(response);
            console.log("Transaction Success:", response.data.action);

            



      } catch (error) {
       console.error("Transaction failed or timed out:", error);
    
        setLikes(previousLikes);
        setLikeCount(previousCount);
      }
};




 
  

     
     return(
                
                  
                  
                   <Link to = {`/movieListPage/${_id}`}>
            
                <div >
                
<div class="group relative w-80 rounded-xl overflow-hidden
                bg-gradient-to-br from-gray-800 to-blue-900
                shadow-md shadow-cyan-500/10
                transition transform hover:-translate-y-1 ">
        
            <img className="w-full aspect-[16/9] object-cover
               transition-transform duration-500
               " src={`${API_BASE_URL}/${image}`}/>
    <div className="absolute inset-0
                  bg-gradient-to-t
                  from-black/80 via-black/40 to-transparent" />
           
        <div className="absolute bottom-14 px-4">
    <p className="text-white text-lg font-semibold leading-tight mb-3">
      {listTitle}
    </p>
  </div>
        <div className="relative flex items-center justify-between px-4 py-3 bg-black/40backdrop-blur-sm">
        
        <div class="flex items-center gap-2 ">
            <img class="h-8 w-8 rounded-full object-cover" src={`${API_BASE_URL}/${userId.image}`} alt="Richard Nelson" />
            <p class="text-gray-200 text-sm font-medium">{userId.username}</p>
          
        </div>
       
        <div className="flex ml-13" >
  <div className="flex items-center gap-3"><button className={`flex items-center gap-1 
                   px-3 py-1.5 rounded-full
                   text-white text-sm
                    ${token ? "cursor-pointer" : ""}`} onClick={toggleLike} ><img className="w-5 h-5" src={`${likedIcon}`} /></button><p className="text-white ">{likeCount}</p></div>
  <div className="flex gap-3 items-center"><button className="flex items-center gap-1 
                   px-3 py-1.5 rounded-full
                   text-gray-200 text-sm ml-3
                  "  ><img className="w-5 h-5" src={`/comment.svg`} /></button><p className="text-white">{commentCount}</p></div>
</div>
    </div>
    </div>

</div>
               

                
                </Link>
               


                
                
                
                  
                  
                

                
                
                
           
            
            )


}

export default MovieListCard;