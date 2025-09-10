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
            <div className="header">
                <nav className="header-nav">
                    <h1 className="title">Movie App</h1>
                    <br />
                    <ul className="nav-links">
                        <li className="link"><Link to ="/home">Browse</Link></li>
                        <li className="link">   
                            <div className="category-block">
                            <Link to = "/categories">Categories</Link>
                                <div className="category-container">
                                    {genres.map((genre) => (
                                    <Link className="genre" to ={`/categories/${genre.id}/${genre.name}`}>{genre.name || 'Not found'} </Link>
                                        ))}
                                </div>
                                </div>
                        </li>
                        <li className="link"><Link to ="/liked">Liked</Link></li>
                        <li className="link"><Link to ="/watchlist">WatchList</Link></li>
                        <li className="link"><Link to ="/diary">Diary</Link></li>
                        <li className="link"><Link to ="/rated">Rated</Link></li>
                        <li className="link"><Link to ="/movielist">MovieList</Link></li>
                        <button className="logoutBtn"><li className="logout"><Link className="logoutStyle" onClick={logout}>Logout</Link></li></button>
                         
                         
                    
                        

            
                    </ul>
                    
                </nav>
                <Outlet />
            </div>
    );
};

export default Nav;