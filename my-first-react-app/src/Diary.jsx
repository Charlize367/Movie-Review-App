import React from 'react'
import { useState, useEffect } from 'react'
import Nav from './components/Nav.jsx'
import Search from './components/Search.jsx'
import MovieCard from './components/MovieCard.jsx'
import {useParams} from "react-router-dom";
import axios from "axios"

const Diary = () => {
  const API_URL = 'http://localhost:3000/api/v1';
  const userId = localStorage.getItem('user_ID');
  const [diary, setDiary] = useState([]);
   const [isLoading, setIsLoading] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");
  const token = localStorage.getItem('jwtToken');


  const getDiary = async () => {
       try {
             const response = await axios.get(`${API_URL}/users/${userId}/diary`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
              });

              console.log(response);
              setDiary(response.data.diary);

              
              
            } catch (error) {
              console.log(error);
              
            }
          }
  
      useEffect(() => {
      getDiary();
      
    }, [userId]);
  return (
    <div className="container">
      <Nav/>

        <h2 className="text-2xl text-white font-bold ml-10">Browse Diary</h2>

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
          {diary.map((movie) => (
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

export default Diary