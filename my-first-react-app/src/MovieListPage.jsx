import React from 'react'
import { useState, useEffect } from 'react'
import Nav from './components/Nav.jsx'
import Search from './components/Search.jsx'
import MovieCard from './components/MovieCard.jsx'
import {useParams, useNavigate} from "react-router-dom";
import axios from "axios"
import CommentsSection from './components/CommentsSection.jsx'


const MovieListPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const apiUrl =  import.meta.env.VITE_TMDB_API_URL;
const apiKey = import.meta.env.VITE_TMDB_API_KEY;

const apiOptions = {
  method: 'GET',
  headers : {
    accept: 'application/json',
    Authorization: `Bearer ${apiKey}`
  }
}
  const userId = localStorage.getItem('user_ID');
  const [movieList, setMovieList] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [errorMessage, setErrorMessage] = useState("");
  const token = localStorage.getItem('jwtToken');
  const param = useParams();
  const [isActive, setIsActive] = useState(false);
  const [isActive2, setIsActive2] = useState(false);
  const [isActive3, setIsActive3] = useState(false);
 
  const [movieOptions, setMovieOptions] = useState([]);
    const [selectedMovieIds, setSelectedMovieIds] = useState([]);
    const [selectedMovies, setSelectedMovies] = useState([]);
    const [search, setSearch] = useState("");
  const [imageData, setImageData] = useState("");
  const navigate = useNavigate();
  

  const getMovieList = async () => {
       try {

     
       
             const response = await axios.get(`${API_URL}/movieList/${param.id}`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
              });

              console.log(response);
              setMovieList(response.data.data);
              setIsLoading(false);
             
              
              
  
              
            } catch (error) {
              console.log(error);
              
            }
          }

          
  
      useEffect(() => {
      getMovieList();
      
    }, []);

  const openForm = () => {
    setIsActive(!isActive);
    setFormData({
          listTitle: movieList?.listTitle,
          listDescription: movieList?.listDescription,
    });
}

const openForm2 = () => {
    setIsActive3(!isActive3);
    setSelectedMovieIds([]);
    setSelectedMovies([]);
    setSearch("");
}


  


  

  console.log(movieList);

  const [formData, setFormData] = useState({
          listTitle: movieList?.listTitle,
          listDescription: movieList?.listDescription,
    });
  
    useEffect(() => {
  if (movieList) {
    setFormData({
      listTitle: movieList.listTitle,
      listDescription: movieList.listDescription,
    });
  }
}, [movieList]);

const openImageForm = () => {
   
    
    setImageData({
      image: movieList.image
      });

    setIsActive2(!isActive2);
  }

    console.log(formData);
    console.log(movieList.listTitle);
  
    const handleChange = (e) => {
            const { name, value, files, type } = e.target;
        setFormData({ ...formData, [name]: type === "file" ? files[0] : value,
            });
    }

    const handleChange2 = (e) => {

    const file = e.target.files[0]; 

  setImageData(prev => ({
    ...prev,
    image: file
  }));

  }


    const editMovieListDetails = async(e) => {

    e.preventDefault();
    

    const finalData = {
      listTitle: formData.listTitle,
      listDescription: formData.listDescription
    }


    try {
        const response = await axios.put(`${API_URL}/movieList/${movieList._id}`, finalData, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
              });

              console.log(response);

              
              setIsActive(isActive);
              e.target.reset();

              getMovieList();

              } catch (error) {
              console.log(error);
              
            }
          }

    const updateCoverPhoto = async(e) => {
       e.preventDefault();
      
      
      try {
        const formData = new FormData();
    formData.append("image", imageData.image);
          const response = await axios.put(`${API_URL}/movieList/${movieList._id}/image`, formData, {
                    headers: {
                         
                         'Authorization': `Bearer ${token}`
                    }
                });
  
                console.log(response);
  
                
                setIsActive2(!isActive2);
                e.target.reset();
  
                getMovieList();
  
                } catch (error) {
                console.log(error);
                
              }
    }

    const displayMovieOptions = async (query = '') => {
  
     
      try {
        const endpoint =  `${apiUrl}/search/movie?query=${encodeURIComponent(query)}`;
  
        const response = await fetch(endpoint, apiOptions);
  
        if (!response.ok) {
          throw new Error("Failed to fetch movies.");
        }
  
        const data = await response.json();
        console.log(data);
  
        if (data.Response == false) {
          setMovieOptions([]);
          return;
  
        }
  
        setMovieOptions(data.results || []);
  
      } catch (error) {
        console.error(`Error fetching movies: ${error}`);
       
      }
  
    
    }

    const getMovieIdByTmdbId = async (tmdbId) => {

    
       try {
             const response = await axios.get(`${API_URL}/movies/${tmdbId}/tmdbId`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
              });

              console.log(response);
              
              return response.data._id;

              
            } catch (error) {
              console.log(error);
              
            }
          }
  
  
    useEffect(() => {
      displayMovieOptions(search);
    }, [search]);


      const getMovieDetails = async (tmdbId) => {
        try {
          const endpoint = `${apiUrl}/movie/${tmdbId}`;
      
          const response = await fetch (endpoint, apiOptions);
      
          if (!response.ok) {
            throw new Error ("Failed to fetch movie details");
          }
      
          const data = await response.json();
      
          if (data.Response == false) {
            return;
          }

          const selectedMovieExists = selectedMovies.some(
          movie => movie.id === data.id
        );

        if (selectedMovieExists) return;

         setSelectedMovies([...selectedMovies, data]);
         return data;
          
        } catch (error) {
          console.error(`Error handling movie details ${error}`);
        }
      }
      
      

      const addMovieIfNotExists = async (tmdbId) => {
           
          
            const movieDetails = await getMovieDetails(tmdbId);

            
            console.log(movieDetails);
          const inputData = {
            'tmdbId' : tmdbId,
            'title' : movieDetails.title,
            'posterPath' : movieDetails.poster_path,
            'releaseDate' : movieDetails.release_date,
            'likedBy' : [],
            'ratings' : []
          
          }
      
        
      
                  const response = await axios.post(`${API_URL}/movies`, inputData, {
                        headers: {
                             'Content-Type': 'application/json',
                             'Authorization': `Bearer ${token}`
                        }
                    });
    
                    console.log(response);
                    const movie_ID = response.data.exists === false 
                      ? response.data.data._id
                      : response.data.data._id;
      
                      console.log(movie_ID);
                      return movie_ID
                
                } 

      const selectMovieOption = async(tmdbId) => {
        const movieId = await addMovieIfNotExists(tmdbId);
        
        console.log(movieId);

        const selectedMovieSelected = selectedMovieIds.includes(movieId);

        const selectedMovieExists = movieList.movies.find(movie => movie._id === movieId);

        if (selectedMovieSelected) return;
        
        if (selectedMovieExists) { 
          window.alert("Movie is already in list.");
          removeMovieOption(tmdbId);
        }
        
        setSelectedMovieIds([...selectedMovieIds, movieId])
        
      }

      const removeMovieOption = async(tmdbId) => {
        const updatedSelectedMovies = selectedMovies.filter(movie => movie.id !== tmdbId);

        const movie_ID = await getMovieIdByTmdbId(tmdbId);
        const updatedSelectedMovieIds = selectedMovieIds.filter(movieId => movieId != movie_ID)

        console.log(movie_ID);
        console.log(updatedSelectedMovieIds);
        console.log(updatedSelectedMovies);
        setSelectedMovies(updatedSelectedMovies);
        setSelectedMovieIds(updatedSelectedMovieIds);
      }

      const removeMovieFromList = async(movieId) => {

        try {
          const response = await axios.delete(`${API_URL}/movieList/${movieList._id}/${movieId}/deleteMovie`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

          console.log(response);
          getMovieList();
        } catch (error) {
          console.error(error);
        }
      }

  const addMovieToList = async(e) => {
        e.preventDefault();



        try {

            const response = await axios.post(`${API_URL}/movieList/${movieList._id}/addMovie`, { movies : selectedMovieIds }, {
                headers: {
                    Authorization: `Bearer ${token}`

                }
            });

            console.log(response); 

            setIsActive3(false);
            getMovieList();
            
            setSelectedMovieIds([]);
            setSelectedMovies([]);
        } catch (error) {
            console.error("FULL ERROR:", error);
        }
      }

      const deleteMovieList = async() => {
      
         
          try {
              const response = await axios.delete(`${API_URL}/movieList/${movieList._id}`, {
                        headers: {
                             'Content-Type': 'application/json',
                             'Authorization': `Bearer ${token}`
                        }
                    });
      
                    console.log(response);
      
                    
                  
      
                    navigate('/movieList');
      
                    } catch (error) {
                    console.log(error);
                    
                  }
        }
   
  
console.log(isActive);
console.log(isActive2);
  return (
    <div className="w-full">
      <Nav/>

      <div className="flex mt-10 lg:space-x-10">
        <div className="max-w-4xl m-10 lg:mx-auto mb-12">
        <h1 className="text-5xl font-extrabold text-white leading-tight">{movieList.listTitle}</h1>
         <p className="mt-6 text-gray-300 text-lg leading-relaxed">{movieList.listDescription}</p>
         {movieList.userId === userId && (
  <div className="flex flex-wrap gap-3 mt-4">
    <button
      onClick={openForm}
      className="px-4 py-2 rounded-2xl text-white font-medium
                 bg-gradient-to-r from-blue-700 to-cyan-600
                 hover:scale-105 transition flex">
      <img className="mr-2 w-5 h-5" src={`/edit-icon.svg`}/>
      Edit
    </button>

    <button
      onClick={openImageForm}
      className="px-4 py-2 rounded-2xl text-white font-medium
                 bg-gradient-to-r from-blue-700 to-cyan-600
                 hover:scale-105 transition flex">
      <img className="mr-2 w-5 h-5" src={`/edit-icon.svg`}/>
      Change Cover
    </button>

    <button
      onClick={openForm2}
      className="px-4 py-2 rounded-2xl text-white font-medium
                 bg-gradient-to-r from-blue-700 to-cyan-600
                 hover:scale-105 transition">
      + Add Movie
    </button>

    <button
      onClick={deleteMovieList}
      className="px-4 py-2 rounded-2xl text-white font-medium
                 bg-red-800 hover:bg-red-700 transition flex">
      <img className="mr-2 w-5 h-5" src={`/delete-icon.svg`}/>
      Delete List
    </button>
  </div>
)}

        </div>
      
      </div>
      

      <section className="all-movies">
        {isLoading ? (
            <center>
          <img className="spinner" src="../Spinner.svg"/>
          </center>
        ) : errorMessage ? (
        <p>{errorMessage}</p>
      ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 sm:grid-cols-2
    md:grid-cols-3 lg:gap-8 py-6 px-4 m-15">
  
          {movieList?.movies?.map((movie) => (
            <div>
             <div className="aspect-[2/3] z-99 position-relative rounded-lg overflow-hidden rounded bg-gray-300">
            <MovieCard movie={movie}/>

            
            </div>
            {movieList.userId == userId && (
            <button type="button" className="text-white rounded-2xl p-3 mt-3 text-white font-medium
                 bg-gradient-to-r from-blue-700 to-cyan-600
                 hover:scale-105 transition flex" onClick={() => removeMovieFromList(movie._id)}><img className="w-5 h-5" src={`/delete-icon.svg`}/></button>
            )}
            </div>
            
          ))}
          
          
          </div>
  )}
      </section>


      <div >
           <div class="relative p-4 w-full max-h-full">
             
              {isActive && (
             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
           <div class="flex items-center rounded-lg  pb-4 md:pb-5">
             
                 
             </div>

           <form onSubmit={editMovieListDetails} className=" md:pt-3" >
            <div className="flex">
        <h3 class="text-xl font-semibold text-white text-heading">
                     Create a Movie List
                 </h3>
                 <button type="button" onClick={openForm} class="text-body text-white bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base  text-sm w-9 h-9 ms-auto inline-flex justify-center items-center" data-modal-hide="authentication-modal">
                     <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/></svg>
                     <span class="sr-only">Close modal</span>
            </button>
            </div>

        <label className="text-sm font-medium text-white mb-5">Title:</label>
           <input value={formData.listTitle} onChange={handleChange} class="p-3 mt-3 rounded-lg w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800 mb-3" placeholder="Add title..." name="listTitle"  />
           <label className="text-sm font-medium text-white  mb-5">Description:</label>
           <textarea rows="6" value={formData.listDescription} onChange={handleChange} class="p-3 mt-3 rounded-lg w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800" placeholder="Add description..." name="listDescription"  />
            
     <div className="col-span-2 flex justify-center">
                       
          </div>
           <button class="block w-full  mt-10 mb-5 rounded-lg border border-blue-600 bg-blue-900 px-12 py-3 text-sm font-medium text-white transition-colors hover:bg-transparent hover:text-indigo-600 dark:hover:bg-indigo-700 dark:hover:text-white" type="submit">Add</button>
         
           </form>
         </div>
           )}
           
             </div>
          <div class="relative p-4 w-full max-h-full">
             {isActive3 && (
             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
           <div class="flex  items-center  rounded-lg  pb-4 md:pb-5">
             
                
             </div>
             <form onSubmit={addMovieToList} className="w-85" >
              <div className="flex max-w-md">
               <h3 class="text-2xl font-semibold text-white text-heading">
                    Add a movie
                 </h3>
                 <button type="button" onClick={() => {openForm2(); setSelectedMovieIds([]); setSelectedMovies([]); setSearch("")}} class="text-body text-white bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base  text-sm w-9 h-9 ms-auto inline-flex justify-center items-center" data-modal-hide="authentication-modal">
                     <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/></svg>
                     <span class="sr-only">Close modal</span>
                 </button>
                </div>
           <label className="block text-md font-medium text-white mt-1 mb-1 " htmlFor="file_input">Add films</label>
           
      <div>
        <div class="relative w-fulls">
        
        
        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg class="w-4 h-4 text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/></svg>
        </div>
        <input type="search" id="search" value={search} onChange={(event) => setSearch(event.target.value)} class="block w-full rounded-lg p-3 ps-9 dark:text-white dark:placeholder-gray-400 dark:bg-gray-800 mb-1 text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body" placeholder="Search" required />
        <button type="button" class="absolute end-1.5 bottom-1.5 text-white bg-brand hover:bg-brand-strong box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded text-xs px-3 py-1.5 focus:outline-none">Add</button>
    
    </div>
    {search != "" && (
    <div id="dropdown" class="z-10 h-25 w-full overflow-y-auto dark:placeholder-gray-400 dark:bg-gray-800 text-white mb-2 rounded-base shadow-lg w-44">
            <ul class="p-2 flex flex-col text-sm text-body font-medium" aria-labelledby="dropdown-button">
                {movieOptions.map(m => 
                <button type="button" className="hover:bg-gray-400" onClick={() => selectMovieOption(m.id)} disabled={selectedMovies.some(movie => movie.id === m.id)}>
                <li className="flex items-center mb-3">
                    <img className="w-15 h-15 rounded-lg" src={m.poster_path ? `https://image.tmdb.org/t/p/w500/${m.poster_path}` : null} />
                    <p class="block p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded-md">{m.title}</p>
                </li>
                </button>
                )}
            </ul>
                
        </div>
    )}
    
        </div>
    

<div class="relative overflow-x-auto dark:placeholder-gray-400 dark:bg-gray-800 text-white shadow-xs rounded-base mb-2">
    <table class="w-full text-sm text-left rtl:text-right text-body">
        {selectedMovies?.map(m =>
           
        
        <tbody>
            <tr class="bg-neutral-primary-soft  hover:bg-neutral-secondary-medium">
                <td class="p-4">
                    <img src={m.poster_path ? `https://image.tmdb.org/t/p/w500/${m.poster_path}`: null} class="w-16 md:w-24 max-w-full max-h-full" alt="Apple Watch"/>
                </td>
                <td class="px-6 py-4 font-semibold text-heading">
                    {m.title}
                </td>
               
                <td class="px-6 py-4">
                    <button type="button" onClick={() => removeMovieOption(m.id)} class="font-medium text-fg-danger hover:underline">Remove</button>
                </td>
            </tr>
            
        </tbody>
        )}
    </table>
</div>
<button class="block w-full  mt-10 mb-5 rounded-lg border border-blue-600 bg-blue-900 px-12 py-3 text-sm font-medium text-white transition-colors hover:bg-transparent hover:text-indigo-600 dark:hover:bg-indigo-700 dark:hover:text-white" type="submit">Add</button> 
       </form>
         </div>
         
           )}
                </div>
                </div>
                

      {isActive2 && (
       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
  <div class=" rounded-2xl p-4 shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
  <form onSubmit={updateCoverPhoto}>
   
  <h2 className="text-lg font-bold text-white mb-3">Edit Cover Photo</h2>
  <label className="text-white">Cover Photo:</label>
          <input type="file" name="image" onChange={handleChange2} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3
                 text-gray-100 placeholder-gray-400
                 focus:ring-2 focus:ring-indigo-500
                 shadow-inner mb-4" />
    
      <button className="text-gray-400 hover:text-white" onClick={openImageForm}>Cancel</button>
      <button className="bg-indigo-600 hover:bg-indigo-500 px-4 ml-2 py-2 rounded-lg text-white">
        Save
      </button>
 
    </form>
  </div>
  </div>
      )}
      
      <CommentsSection movieListId={movieList._id} />
      
    </div>

  )
}

export default MovieListPage