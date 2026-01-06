import React from "react"
import { useState, useEffect } from 'react'
import { Outlet, NavLink, Link } from "react-router-dom";
import { useAuth } from '../auth/AuthContext';

const apiUrl =  'https://api.themoviedb.org/3';
const apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ODI1MGEyNjQ5YTAwYTk2OTdlYjIxMGUzMTExZGE1YyIsIm5iZiI6MTcyMjU4NzAzNS43MTYsInN1YiI6IjY2YWM5NzliNTEyMTNhZjA5MWJkNThhMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.zrM-3dtjvwa-al-qRd70tlGRD0VkxCFbHgYmZEzY6gA';

const apiOptions = {
  method: 'GET',
  headers : {
    accept: 'application/json',
    Authorization: `Bearer ${apiKey}`
  }
}

const Nav = () => {

    const [errorMessage, setErrorMessage] = useState("");
    const [genres, setGenres] = useState([]);
    const [genre_ID, setGenreID] = useState(0);
    const { logout } = useAuth();
    const [open, setOpen] = useState(false);
    
    
  

      const displayGenres = async () => {
          try {
            const endpoint = `${apiUrl}/genre/movie/list?language=en`;
      
            const response = await fetch (endpoint, apiOptions);
      
            if (!response.ok) {
              throw new Error ("Failed to fetch genres");
            }
      
            const data = await response.json();
            console.log(data);
      
            if (data.Response == false) {
              setErrorMessage(data.Error || 'Failed to fetch genres')
              setGenres([]);
              return;
            }
      
            setGenres(data.genres || []);
          } catch (error) {
            console.error(`Error fetching genres: ${error}`);
            setErrorMessage('Error fetching genres. Try again later');
          }
        }

         useEffect(() => {
                displayGenres();
              }, []);


    return (
      <div>
 
<nav class="bg-neutral-primary w-full z-99 top-0 start-0 border-default text-white p-3">
  <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    <a href="#" class="flex items-center space-x-3 rtl:space-x-reverse">
        <p class="self-center text-xl text-heading font-semibold whitespace-nowrap">Movie App</p>
    </a>
    <button data-collapse-toggle="navbar-multi-level-dropdown" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-neutral-tertiary" aria-controls="navbar-multi-level-dropdown" aria-expanded="false">
        <span class="sr-only">Open main menu</span>
        <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h14"/></svg>
    </button>
    <div class="hidden w-full md:block md:w-auto" id="navbar-multi-level-dropdown">
      <ul class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-neutral-primary">
        <li>
          <a href="#" class="block py-2 px-3 text-white bg-brand rounded md:bg-transparent md:text-fg-brand md:p-0" aria-current="page"><Link to ="/home">Browse</Link></a>
        </li>
        <li>
            <button id="multiLevelDropdownButton" onClick={() => setOpen(!open)} class="flex items-center justify-between w-full py-2 px-3 rounded font-medium text-heading md:w-auto hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0">
              Categories 
              <svg class="w-4 h-4 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7"/></svg>
          </button>

{open && (
  <div
    id="multi-dropdown"
    className="absolute z-10 bg-white text-black border border-default-medium rounded-base shadow-lg w-44"
  >
    <ul
      className="p-2 text-sm text-body font-medium"
      aria-labelledby="multiLevelDropdownButton"
    >
      {genres.map((genre) => (
        <li key={genre.id}>
          <Link
            className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
            to={`/categories/${genre.id}/${genre.name}`}
          >
            {genre.name || "Not found"}
          </Link>
        </li>
      ))}
    </ul>
  </div>
)}

        </li>
        <li>
          <a href="#" class="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent"><Link to ="/list">WatchList</Link></a>
        </li>
        <li>
          <a href="#" class="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent"><Link to ="/liked">Liked</Link></a>
        </li>
        <li>
          <a href="#" class="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent"><Link to ="/diary">Diary</Link></a>
        </li>
        <li>
          <a href="#" class="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent"><Link to ="/rated">Ratings</Link></a>
        </li>
         <li>
          <a href="#" class="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent"><Link to ="/movieList">Lists</Link></a>
        </li>
        <li>
          <a href="#" class="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent"><Link to ="/account">Account</Link></a>
        </li>
         <li>
          <a href="#" class="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent"><Link className="logoutStyle" onClick={logout}>Logout</Link></a>
        </li>
        
      </ul>
    </div>
  </div>
</nav>


        
            </div>
    );
};

export default Nav;