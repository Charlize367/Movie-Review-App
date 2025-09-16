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

  const getDiary = async () => {
       try {
             const response = await axios.get(`${API_URL}/users/${userId}/duary`, {
                  headers: {
                       'Content-Type': 'application/json'
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

        <h2>Browse Diary</h2>

      <section className="all-movies">
        {isLoading ? (
            <center>
          <img className="spinner" src="/Spinner.svg"/>
          </center>
        ) : errorMessage ? (
        <p>{errorMessage}</p>
      ) : (
          <ul className="movie-display">
          {diary.map((movie) => (
            <MovieCard movie={movie}/>
          ))}
          </ul>
  )}
      </section>
    </div>

  )
}

export default Diary