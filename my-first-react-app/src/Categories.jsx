import React from 'react'
import { useState, useEffect } from 'react'
import Nav from './components/Nav.jsx'
import MovieCard from './components/MovieCard.jsx'
import {useParams} from "react-router-dom";
import { displayMoviesByCategory } from './services/api.js';
import { useQuery } from '@tanstack/react-query';

const Categories = ()  => {
  const param = useParams();


   const { data: movies, isLoading, isError } = useQuery({
    queryKey: ['movies'],
    queryFn: () => displayMoviesByCategory(param.id)
  });
    

  if (isError) return <p>Error loading movies</p>;
  if (isLoading) return <center><img className="spinner" src="./Spinner.svg"/></center>


    return(
    <div className="w-full">
      <Nav/>

       <h2 className="text-4xl text-white font-bold m-15">Browse {param.name} Movies</h2>

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

   
          
          
    )
}


export default Categories;
