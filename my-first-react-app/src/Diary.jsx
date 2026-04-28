import React from 'react'
import { useState, useEffect } from 'react'
import Nav from './components/Nav.jsx'
import Search from './components/Search.jsx'
import MovieCard from './components/MovieCard.jsx'
import {useParams} from "react-router-dom";
import axios from "axios"

const Diary = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const userId = localStorage.getItem('user_ID');
  const [diary, setDiary] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
              setIsLoading(false);

              
              
            } catch (error) {
              console.log(error);
              setErrorMessage(error);
              
            }
          }
  
      useEffect(() => {
      getDiary();
      
    }, [userId]);
  return (
    <div className="w-full">
      <Nav/>

        <h2 className="text-3xl text-white font-bold ml-15 mt-5">Browse Diary</h2>
       
      <section className="all-movies">
        {isLoading ? (
            <center>
          <img className="spinner" src="/Spinner.svg"/>
          </center>
        ) : errorMessage ? (
        <p>{errorMessage}</p>
      ) : diary.length == 0 ? (
         <p className="text-white text-md m-15"> No movies in Diary.</p>
      ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-6 sm:grid-cols-2
    md:grid-cols-3 lg:gap-8 py-6 px-4 m-10">
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