import React from 'react'
import { useState, useEffect } from 'react'
import Nav from './components/Nav.jsx'
import Search from './components/Search.jsx'
import MovieCard from './components/MovieCard.jsx'
import {useParams} from "react-router-dom";
import axios from "axios"

const Liked = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const userId = localStorage.getItem('user_ID');
  const [likedMovies, setLikedMovies] = useState([]);
   const [isLoading, setIsLoading] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");
  const token = localStorage.getItem('jwtToken');

  const getUserLikes = async () => {
       try {
             const response = await axios.get(`${API_URL}/users/${userId}/likedMovies`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
              });

              console.log(response);
              setLikedMovies(response.data.likedMovies);

              
              
            } catch (error) {
              console.log(error);
              
            }
          }
  
      useEffect(() => {
      getUserLikes();
      
    }, [userId]);

    console.log(likedMovies);
  return (
    <div className="container">
      <Nav/>

        <h2 className="text-2xl text-white font-bold ml-10">Browse Liked Movies</h2>

      <section className="all-movies">
        {isLoading ? (
            <center>
          <img className="spinner" src="/Spinner.svg"/>
          </center>
        ) : errorMessage ? (
        <p>{errorMessage}</p>
      ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 sm:grid-cols-2
    md:grid-cols-3 lg:gap-8 py-6 px-4">
  
          {likedMovies.map((movie) => (
             <div className="aspect-[2/3] rounded-lg overflow-hidden rounded bg-gray-300">
            <MovieCard movie={movie}/>
            </div>
          ))}
          
          
          </div>
  )}
      </section>
    </div>

  )
}

export default Liked
