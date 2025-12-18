import React from 'react'
import { useState, useEffect } from 'react'
import Nav from './components/Nav.jsx'
import Search from './components/Search.jsx'
import MovieCard from './components/MovieCard.jsx'
import {useParams} from "react-router-dom";

const apiUrl =  'https://api.themoviedb.org/3';
const apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ODI1MGEyNjQ5YTAwYTk2OTdlYjIxMGUzMTExZGE1YyIsIm5iZiI6MTcyMjU4NzAzNS43MTYsInN1YiI6IjY2YWM5NzliNTEyMTNhZjA5MWJkNThhMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.zrM-3dtjvwa-al-qRd70tlGRD0VkxCFbHgYmZEzY6gA';

const apiOptions = {
  method: 'GET',
  headers : {
    accept: 'application/json',
    Authorization: `Bearer ${apiKey}`
  }
}



const Categories = ()  => {

     const [isLoading, setIsLoading] = useState(false);
      const [movies, setMovies] = useState([]);
      const [search, setSearch] = useState("");
      const [errorMessage, setErrorMessage] = useState("");
      const [genre_ID, setGenreID] = useState();


      const param = useParams();
  
    const displayMoviesByCategory = async () => {
      setIsLoading(true);

      try {
        const endpoint = `${apiUrl}/discover/movie?with_genres=${param.id}&include_adult=false&include_video=false&language=en-US&page=1&sort_bypopularity.desc`

        const response = await fetch(endpoint, apiOptions);

        if(!response.ok) {
          throw new Error("Failed to fetch movies");
        }

        const data = await response.json();
        console.log(data);
        console.log(endpoint);

        if (data.Response == false) {
          setErrorMessage(data.Error || `Failed to fetch movies`);
          setMovies([]);
          return;
        }

        setMovies(data.results || []);
      } catch (error) {
        console.error(`Error fetching movies :${error}`);
        setErrorMessage('Error fetching movies. Try again');
      } finally {
        setIsLoading(false);
      }
    }
    
    useEffect(() => {
      displayMoviesByCategory();
    }, [param.id]);
      

    return(
    <div className="w-full">
      <Nav/>

       <h2 className="text-2xl text-white font-bold ml-10">Browse {param.name} Movies</h2>

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
  
          {movies.map((movie) => (
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


export default Categories;
