import React from 'react'
import { useState, useEffect } from 'react'
import Nav from './components/Nav.jsx'
import Search from './components/Search.jsx'
import MovieCard from './components/MovieCard.jsx'
import {useParams} from "react-router-dom";
import axios from "axios"

const List = () => {
  const API_URL = 'http://localhost:3000/api/v1';
  const userId = localStorage.getItem('user_ID');
  const [watchList, setWatchList] = useState([]);
   const [isLoading, setIsLoading] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");

  const getWatchList = async () => {
       try {
             const response = await axios.get(`${API_URL}/users/${userId}/watchlist`, {
                  headers: {
                       'Content-Type': 'application/json'
                  }
              });

              console.log(response);
              setWatchList(response.data.watchListMovies);

              
              
            } catch (error) {
              console.log(error);
              
            }
          }
  
      useEffect(() => {
      getWatchList();
      
    }, [userId]);
  return (
    <div className="container">
      <Nav/>

        <h2>Browse WatchList</h2>

      <section className="all-movies">
        {isLoading ? (
            <center>
          <img className="spinner" src="/Spinner.svg"/>
          </center>
        ) : errorMessage ? (
        <p>{errorMessage}</p>
      ) : (
          <ul className="movie-display">
          {watchList.map((movie) => (
            <MovieCard movie={movie}/>
          ))}
          </ul>
  )}
      </section>
    </div>

  )
}

export default List