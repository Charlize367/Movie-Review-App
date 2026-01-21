
import React from 'react'
import { useState, useEffect } from 'react'
import Nav from './components/Nav.jsx'
import axios from 'axios';
import MovieListCard from './components/MovieListCard.jsx';



const MovieList = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const apiUrl =  import.meta.env.VITE_TMDB_API_URL;
const apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ODI1MGEyNjQ5YTAwYTk2OTdlYjIxMGUzMTExZGE1YyIsIm5iZiI6MTcyMjU4NzAzNS43MTYsInN1YiI6IjY2YWM5NzliNTEyMTNhZjA5MWJkNThhMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.zrM-3dtjvwa-al-qRd70tlGRD0VkxCFbHgYmZEzY6gA';

const apiOptions = {
  method: 'GET',
  headers : {
    accept: 'application/json',
    Authorization: `Bearer ${apiKey}`
  }
}
  const token = localStorage.getItem('jwtToken');
  const userId = localStorage.getItem('user_ID');
  const [isActive, setIsActive] = useState(false);
  const [movieLists, setMovieLists] = useState([]);
  const [myMovieLists, setMyMovieLists] = useState([]);
  const [movieOptions, setMovieOptions] = useState([]);
  const [selectedMovieIds, setSelectedMovieIds] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [search, setSearch] = useState("");
  
  

console.log(selectedMovies);
console.log(movieOptions);


  const openForm = (id) => {
    setIsActive(!isActive);
    setSelectedMovieIds([]);
    setSelectedMovies([]);
    setFormData({
          listTitle: "",
          listDescription:"",
          likes: [],
          comments: [],
          image: null

      })
    setSearch("");
}

const [formData, setFormData] = useState({
          listTitle: "",
          listDescription:"",
          likes: [],
          comments: [],
          image: null

      });
    
  
    const handleChange = (e) => {
            const { name, value, files, type } = e.target;
        setFormData({ ...formData, [name]: type === "file" ? files[0] : value,
            });
    }



  const getMyMovieLists = async () => {
       try {

       
             const response = await axios.get(`${API_URL}/movieLists/${userId}`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
              });

              console.log(response);
              setMyMovieLists(response.data);
              
              
  
              
            } catch (error) {
              console.log(error);
              
            }
          }
  
      useEffect(() => {
      getMyMovieLists();
      
    }, []);

    const getMovieLists = async () => {
       try {

       
             const response = await axios.get(`${API_URL}/movieList`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
              });

              console.log(response);
              setMovieLists(response.data.data);
              
              
  
              
            } catch (error) {
              console.log(error);
              
            }
          }
  
      useEffect(() => {
      getMovieLists();
      
    }, []);

   console.log(movieLists);



  
  

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
      
      console.log(selectedMovies);
      

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

        const selectedMovieExists = selectedMovieIds.includes(movieId);

        if (selectedMovieExists) return;
        
        setSelectedMovieIds([...selectedMovieIds, movieId])
        
      }

      console.log(selectedMovieIds);
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

      const createMovieList = async(e) => {
        e.preventDefault();

        const payload = new FormData();
        payload.append("listTitle", formData.listTitle);
        payload.append("listDescription", formData.listDescription);
        payload.append("movies", JSON.stringify(selectedMovieIds));
        if (formData.image) {
          payload.append("image", formData.image);
        }

        try {

            const response = await axios.post(`${API_URL}/movieList/${userId}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`

                }
            });
            console.log(response);
            setIsActive(false);
            getMovieLists();
            setFormData({
                listTitle: "",
                listDescription: "",
                likes: [],
                comments: [],
                image: null
                });
                setSelectedMovieIds([]);
                setSelectedMovies([]);
        } catch (error) {
            console.error("FULL ERROR:", error);
        }
      }

      
   
  return (
    <div className="w-full">
        
      <Nav/>
      
      <div className="flex justify-center">

      <div className="mb-10 flex flex-col items-center text-center">
         <h2 className="font-bold text-white text-4xl flex items-center mb-5">Movie Lists</h2> 
         <div className="flex items-center text-white text-sm font-medium p-3 max-w-35 rounded-4xl bg-gradient-to-r from-blue-700 to-cyan-600" ><button className="ratingBtn" onClick={openForm}><p className="m-1"> + Add Movie list</p> </button> </div>
        </div>

       </div>
     
       
        
              
             <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            
              {movieLists?.length > 0 && movieLists.map(r =>  
                
            
            <MovieListCard movieList={r}/>
            
            
           
          )}
          

         
            </div>
            
 
 <div className=" overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full" style={isActive ? {display: "flex"} : {display: "none"}}>
           <div class="relative p-4 w-full max-h-full">
             
             <div class="w-full mx-auto max-w-2xl space-y-4 m-30 bg-gray-900 p-6 rounded-lg shadow-xs">
           <div class="flex  items-center rounded-lg  pb-4 md:pb-5">
             
                 <h3 class="text-xl font-semibold text-white text-heading">
                     Create a Movie List
                 </h3>
                 <button type="button" onClick={openForm} class="text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base  text-sm w-9 h-9 ms-auto inline-flex justify-center items-center" data-modal-hide="authentication-modal">
                     <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/></svg>
                     <span class="sr-only">Close modal</span>
                 </button>
             </div>
           <form onSubmit={createMovieList} className=" md:pt-3" >
        

        <label className="text-sm font-medium text-white mb-5">Title:</label>
           <input value={formData.listTitle} onChange={handleChange} class="p-3 mt-3 rounded-lg w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800 mb-3" placeholder="Add title..." name="listTitle"  />
           <label className="text-sm font-medium text-white  mb-5">Description:</label>
           <textarea rows="6" value={formData.listDescription} onChange={handleChange} class="p-3 mt-3 rounded-lg w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800" placeholder="Add description..." name="listDescription"  />
            
            <label className="block text-sm font-medium text-white mt-1" htmlFor="file_input">Add films</label>
           
      <div>
        <div class="relative">
        
        
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
                <button type="button" className="hover:bg-gray-400" onClick={() => selectMovieOption(m.id)} disabled={selectedMovieIds.includes(m.id)}>
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


    <div className="col-span-2 "><label className="block text-sm font-medium text-white mb-1" htmlFor="file_input">Upload an image</label>
                            <input onChange={handleChange} className="block w-full text-sm text-gray-200
               file:mr-4 file:py-2 file:px-4
               file:rounded-lg file:border-0
               file:text-sm file:font-semibold
               file:bg-gray-800 file:text-gray-200
               hover:file:bg-gray-900
                rounded-lg cursor-pointer bg-gray-800" name="image" aria-describedby="file_input_help" id="file_input" type="file"/>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">SVG, PNG, JPG or GIF (MAX. 800x400px).</p>
                        </div>
                        <div className="col-span-2 flex justify-center">
                       
          </div>
           <button class="block w-full  mt-10 mb-5 rounded-lg border border-blue-600 bg-blue-900 px-12 py-3 text-sm font-medium text-white transition-colors hover:bg-transparent hover:text-indigo-600 dark:hover:bg-indigo-700 dark:hover:text-white" type="submit">Add</button>
         
           </form>
         </div>
           
             </div>
                </div>
    </div>
    
  
  )
}

export default MovieList