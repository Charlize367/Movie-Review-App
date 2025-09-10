import React from 'react'
import { useState, useEffect } from 'react'
import Nav from './components/Nav.jsx'
import Search from './components/Search.jsx'
import MovieCard from './components/MovieCard.jsx'



const apiUrl =  'https://api.themoviedb.org/3';
const apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ODI1MGEyNjQ5YTAwYTk2OTdlYjIxMGUzMTExZGE1YyIsIm5iZiI6MTcyMjU4NzAzNS43MTYsInN1YiI6IjY2YWM5NzliNTEyMTNhZjA5MWJkNThhMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.zrM-3dtjvwa-al-qRd70tlGRD0VkxCFbHgYmZEzY6gA';

const apiOptions = {
  method: 'GET',
  headers : {
    accept: 'application/json',
    Authorization: `Bearer ${apiKey}`
  }
}


const Home = ()  => {
  const [isLoading, setIsLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);
  
  const featuredMovies = async () => {
     try {
            const endpoint = `${apiUrl}/trending/movie/day?language=en-US`;
      
            const response = await fetch (endpoint, apiOptions);
      
            if (!response.ok) {
              throw new Error ("Failed to fetch trending movies");
            }
      
            const data = await response.json();
            console.log(data);
      
            if (data.Response == false) {
              setErrorMessage(data.Error || 'Failed to fetch trending movies')
              setTrendingMovies([]);
              return;
            }
      
            setTrendingMovies(data.results || []);
          } catch (error) {
            console.error(`Error fetching trending movies: ${error}`);
            setErrorMessage('Error fetching trending movies. Try again later');
          }
        }

        useEffect(() => {
    featuredMovies();
  }, []);



  const displayMovies = async (query = '') => {

    setIsLoading(true);
    try {
      const endpoint =  query
      ? `${apiUrl}/search/movie?query=${encodeURIComponent(query)}`
      : `${apiUrl}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`;

      const response = await fetch(endpoint, apiOptions);

      if (!response.ok) {
        throw new Error("Failed to fetch movies.");
      }

      const data = await response.json();
      console.log(data);

      if (data.Response == false) {
        setErrorMessage(data.Error || 'Failed to fetch movies')
        setMovies([]);
        return;

      }

      setMovies(data.results || []);

    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Try again later');
    } finally {
      setIsLoading(false);
    }

  
  }


  useEffect(() => {
    displayMovies(search);
  }, [search]);

  return (
    <div className="container">
      <Nav />
      <div className="home-hero">
        <h1 className="home-hero-text">Your world of movies, all in one place.</h1>
      </div>
      <Search search={search} setSearch={setSearch}/>
      <h2 >Trending Movies</h2>

      <section className="all-movies">
        {isLoading ? (
          <center>
          <img className="spinner" src="./Spinner.svg"/>
          </center>
        ) : errorMessage ? (
        <p>{errorMessage}</p>
      ) : (
        
          <ul className="movie-display">
          {movies.map((movie) => (
            <MovieCard movie={movie}/>
          ))}
          </ul>
  )}
      </section>
    </div>

    
)}

export default Home;