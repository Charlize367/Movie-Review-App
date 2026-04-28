import React from 'react'
import { useState, useEffect } from 'react'
import Nav from './components/Nav.jsx'
import Search from './components/Search.jsx'
import MovieCard from './components/MovieCard.jsx'
import {useParams} from "react-router-dom";
import axios from "axios"

const List = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const userId = localStorage.getItem('user_ID');
  const [watchList, setWatchList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const token = localStorage.getItem('jwtToken');

  const getWatchList = async () => {
       try {
             const response = await axios.get(`${API_URL}/users/${userId}/watchlist`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
              });

              console.log(response);
              setWatchList(response.data.data);
              setIsLoading(false);

              
              
            } catch (error) {
              console.log(error);
              setErrorMessage(error);
              
            }
          }
  
      useEffect(() => {
      getWatchList();
      
    }, [userId]);
  return (
    <div className="w-full">
      <Nav/>

        <h2 className="text-3xl text-white font-bold ml-15 mt-5">Browse WatchList</h2>

        

     

        
      <section className="w-full">
        {isLoading ? (
            <center>
          <img className="spinner" src="/Spinner.svg"/>
          </center>
        ) : errorMessage ? (
        <p>{errorMessage}</p>
      ) : watchList.length == 0 ? (
        <p className="text-white text-md m-15"> No movies in WatchList.</p>
      ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-6 sm:grid-cols-2
    md:grid-cols-3 lg:gap-8 py-6 px-4 m-10">
  
          {watchList.map((movie) => (
             <div className="aspect-[2/3] rounded-lg overflow-hidden rounded bg-gray-300">
            <MovieCard movie={movie?.movieId[0]}/>
            </div>
          ))}
          
          
          </div>
  )}
  
      </section>
    </div>

  )
}

export default List