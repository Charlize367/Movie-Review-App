import React from 'react'
import { useState, useEffect } from 'react'
import Nav from './components/Nav.jsx'
import Search from './components/Search.jsx'
import MovieCard from './components/MovieCard.jsx'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { displayMovies } from './services/api.js'

const Home = ()  => {
  const [search, setSearch] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const location = useLocation();


  useEffect(() => {
  if (location.state?.popup) {
    setPopupMessage(location.state.popup);
    setShowPopup(true);

    setTimeout(() => setShowPopup(false), 3000);
    window.history.replaceState({}, document.title);
  }
}, []);



  const { data: movies, isLoading, isError } = useQuery({
    queryKey: ['movies', search],
    queryFn: () => displayMovies(search)
  })

console.log(movies);

  if (isError) return <p>Error loading movies</p>;
  
  

  return (
    <div>
      <Nav />
      <div className="flex justify-center relative mt-10 lg:mt-24 px-4">
        <h1 className="text-center max-w-4xl font-bold text-white leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl
  ">Your world of movies, all in one place.</h1>
      </div>


{showPopup && (
            <div
        className={`
          fixed top-6 right-6 z-50 max-w-xs z-99 w-full p-4 rounded-xl shadow-lg
          bg-gray-900 text-white text-sm font-medium transition-transform duration-300
          ${showPopup ? "translate-x-0 opacity-100" : "translate-x-32 opacity-0"}
        `}
      >
        {popupMessage}
      </div>
              )}
      <div className="relative w-full flex justify-center items-center m-5 mx-auto">
      <Search search={search} setSearch={setSearch}/>
      </div>
      <h2 className="text-2xl text-white font-bold ml-10">Trending Movies</h2>

     <section>
        {isLoading ? (
          <center>
          <img className="spinner" src="./Spinner.svg"/>
          </center>
       
      ) : (
        <div className="grid grid-cols-2 gap-4 m-5 lg:grid-cols-5 sm:grid-cols-2
    md:grid-cols-3 lg:gap-8 py-6 px-4">
  
          {movies?.map((movie) => (
             <div className="aspect-[2/3] rounded-lg overflow-hidden rounded">
            <MovieCard movie={movie}/>
            </div>
          ))}
          
          
          </div>
  )}
      </section>
    </div>

    
)}

export default Home;