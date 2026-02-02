import React, { useRef } from 'react'
import { Form, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react'
import Nav from './components/Nav.jsx'
import axios from 'axios';
import emptyStar from "/star1.svg";
import halfStar from "/halfStar.svg";
import fullStar from "/star2.svg";
import RatingCard from './components/RatingCard.jsx';
import ActionSkeleton from './components/ActionSkeleton.jsx';




const MovieDetails = () => {
  const API_URL = import.meta.env.VITE_API_URL;
 const apiUrl =  import.meta.env.VITE_TMDB_API_URL;
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const token = localStorage.getItem('jwtToken');
  const [movieDetails, setMovieDetails] = useState(null);
  const [vote, setVote] = useState(0);
  const [date, setDate] = useState("");
  const [cast, setCast] = useState([]);
  const [genre, setGenre] = useState([]);
  const [director, setDirector] = useState([]);
  const [backdrop, setBackdrop] = useState([]);
  const param = useParams();
  const [movies, setMovies] = useState([]);
  const userId = localStorage.getItem('user_ID');
  const [isLiked, setIsLiked] = useState(false);
  const [isListed, setIsListed] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [likedMovies, setLikedMovies] = useState([]);
  const [watchList, setWatchList] = useState([]);
  const [diary, setDiary] = useState([]);
  const [rate, setRate] = useState([]);
  const [rateIcon, setRateIcon] = useState('');
  const [rateText, setRateText] = useState("");
  const [rateFunction, setRateFunction] = useState(() => () => {});
  const [isActive, setIsActive] = useState(false);
  const [ratings, setRatings] = useState(0);
  const [review, setReview] = useState("");
  const [movieLikeCount, setMovieLikeCount] = useState(0);
  const [movie_ID, setMovie_ID] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [credits, setCredits] = useState([]);
  const likeRef = useRef(isLiked);
  const listRef = useRef(isListed);
  const diaryRef = useRef(isWatched);
  const navigate = useNavigate();
  const location = useLocation();
  const [likes, setLikes] = useState([]);
  
 
 
  useEffect(() => {
    if (location.state?.popup) {
      setPopupMessage(location.state.popup);
      setShowPopup(true);
  
      setTimeout(() => setShowPopup(false), 3000);
    }
  }, []);
   

  

              
  const getMovieDetails = async () => {
  try {
    const endpoint = `${apiUrl}/movie/${param.id}`;

    const response = await fetch (endpoint, apiOptions);

    if (!response.ok) {
      throw new Error ("Failed to fetch movie details");
    }

    const data = await response.json();

    console.log(data);

    if (data.Response == false) {
      setErrorMessage(data.Error || 'Failed to fetch movie details');
      setMovieDetails([]);
      return;
    }

    setMovieDetails(data);

    setVote(data.vote_average);
    setDate(data.release_date);
    setGenre(data.genres);
    
  } catch (error) {
    console.error(`Error handling movie details ${error}`);
  }
}



  const addMovieIfNotExists = async () => {
     if (!movieDetails) {
    console.warn("Movie details not loaded yet");
    return null;
  }
    const inputData = {
      'tmdbId' : Number(param.id),
      'title' : movieDetails.title,
      'posterPath' : movieDetails.poster_path,
      'releaseDate' : movieDetails.release_date,
      'likedBy' : [],
      'ratings' : []
    
    }

  

            const response = await axios.post(`${API_URL}/movies`, inputData, {
                  headers: {
                       'Content-Type': 'application/json',
                      
                  }
              });
              console.log(response);
              
             


              return response.data.data._id;
          
          } 

useEffect(() => {
  if (!movieDetails) {
    console.log("No movie details found. Cannot create movie ID")
    return;
  }

  const ensureMovieExists = async () => {
    const id = await addMovieIfNotExists();
    setMovie_ID(id);
    console.log(id);
  };

  ensureMovieExists();
}, [movieDetails]);

  
  const getMovies = async () => {

    
       try {
             const response = await axios.get(`${API_URL}/movies`, {
                  headers: {
                       'Content-Type': 'application/json',
                       
                  }
              });

              console.log(response);
              setMovies(response.data.data);

              
            } catch (error) {
              console.log(error);
              
            }
          }
  useEffect(() => {
      getMovies();
  }, [param.id]);


  useEffect(() => {
    
    setIsLiked(likes.includes(userId));
  }, [likes, userId]);
      
   

  
  
        

  const getUserLikes = async () => {
       try {
             const response = await axios.get(`${API_URL}/users/${userId}/likedMovies`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
              });

              console.log(response);
              setLikedMovies(response.data.likedMovies);
              

              
              
            } catch (error) {
              console.log(error);
              
            }
          }
  
    
    

  const getUserWatchList = async () => {
       try {
             const response = await axios.get(`${API_URL}/users/${userId}/watchlist`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
              });

              console.log(response);
              setWatchList(response.data.watchListMovies);

              
              
            } catch (error) {
              console.log(error);
              
            }
          }
  
     


  const getUserDiary = async () => {
       try {
             const response = await axios.get(`${API_URL}/users/${userId}/diary`, {
                  headers: {
                       'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                  }
              });

              console.log(response);
              setDiary(response.data.diary);

              
              
            } catch (error) {
              console.log(error);
              
            }
          }

    
    const toggleLike = async(e) => {
      e.preventDefault()

      const newLikeState = !isLiked;
  setIsLiked(newLikeState);
  setMovieLikeCount(prev => newLikeState ? prev + 1 : prev - 1);

      try {
        
        if(newLikeState) {

          await axios.post(`${API_URL}/users/${userId}/${movie_ID}/likes`, {}, {
            headers : {
              'Content-Type' : 'application/json',
              'Authorization': `Bearer ${token}`
            }
        });
        setLikes(prev => [...prev, userId]);

        

        } else {

          const selectedLikedMovie = likedMovies.find(movie => movie.tmdbId === Number(param.id));
      

      const likeId = selectedLikedMovie._id;
          await axios.delete(`${API_URL}/users/${userId}/${likeId}/${movie_ID}/like`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
                });
        setLikes(prev => prev.filter(id => id !== userId)); 
               
        }



      } catch (error) {
        console.log(error);
        
        setIsLiked(!newLikeState);
        setMovieLikeCount(prev => likeRef.current ? prev + 1 : prev - 1);
      }
      
    }
   

    const toggleList = async (e) => {

      e.preventDefault()

      listRef.current = !listRef.current;
      setIsListed(listRef.current);
      

      try {

        let message = "";
        if(listRef.current) {

          await axios.post(`${API_URL}/users/${userId}/${movie_ID}/watchlist`, {}, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
          });

          
        message =  "🎬 Movie added to your watchlist"

        } else {

        const selectedListMovie = watchList.find(movie => movie.tmdbId === Number(param.id));
      
      const listId = selectedListMovie._id;
   
         await axios.delete(`${API_URL}/users/${userId}/${listId}/watchlist`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
          });

          message =  "🎬 Movie removed from your watchlist"
        }

      getUserWatchList();
      setShowPopup(true);
      setPopupMessage(message);

      setTimeout(() => setShowPopup(false), 3000);
      

      } catch (error) {
        console.log(error);
        listRef.current = !listRef.current;
        setIsListed(listRef.current);
      }
    }


    const toggleDiary = async (e) => {
      e.preventDefault()

      diaryRef.current = !diaryRef.current;
      setIsWatched(diaryRef.current);
      

      try {
        let message = "";
        if(diaryRef.current) {

          await axios.post(`${API_URL}/users/${userId}/${movie_ID}/diary`, {},  {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
        });
        message =  "🎬 Movie added to your diary"
       

        } else {

        const selectedDiary = diary.find(movie => movie.tmdbId === Number(param.id));
     

      const diaryId = selectedDiary._id;
      
        await axios.delete(`${API_URL}/users/${userId}/${diaryId}/diary`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
                });
          message =  "🎬 Movie removed from your diary"

     
        }
         getUserDiary();
       setShowPopup(true);
      setPopupMessage(message);

      setTimeout(() => setShowPopup(false), 3000);
         
        

      } catch (error) {
        console.log(error);
        diaryRef.current = !diaryRef.current;
        setIsWatched(diaryRef.current);
      }
    }

    
  const handleChange = (e) => {
  setReview(e.target.value);
};

  const openForm = () => {
    setIsActive(!isActive);
    
  }


  
    
    

  const addToRating = async(e) => {
     
      e.preventDefault();
      if (!movie_ID) return;

      try{
        

        const finalData = {
          rating: ratings,
          review: review,
          userId: userId,
          movieId: movie_ID
        };


        const response = await axios.post(`${API_URL}/ratings`, finalData, {
          headers : {
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        console.log(response);

                setShowPopup(true);
                setPopupMessage("Rating added succssfully.")


         setTimeout(() => setShowPopup(false), 3000);

        openForm(!isActive);
        e.target.reset();
        getMovieRatings();
      } catch (error) {
        console.log(error);
      }
    }


  const getMovieRatings = async () => {
       try {

      
        if (!movie_ID) return;

        
        
             const response = await axios.get(`${API_URL}/ratings/movieRatings/${movie_ID}`, {
                  headers: {
                       'Content-Type': 'application/json',
                       
                  }
              });

              console.log(response);
              setRate(response.data);
              
              
  
              
            } catch (error) {
              console.log(error);
              
            }
          }


  const likedIcon = isLiked ? '/liked.svg' : '/like.svg';
  const likedText = isLiked ? 'Liked' : 'Like';
  
  
  const listIcon = isListed ? '/listed.svg' : '/add.svg';
  const listText = isListed ? 'Saved' : 'List';
  
  
  const diaryIcon = isWatched ? '/watched.svg' : '/watch.svg';
  const diaryText = isWatched ? 'Watched' : 'Mark';
  
        


     useEffect(() => {

    const selectedRating = rate.find(movie => movie.tmdbId === Number(param.id))
     

    console.log(rate);

    if(selectedRating) {
      
      
      setRateIcon('/logged.svg');
      setRateText('Rated');
     setRateFunction(() => addToRating);
      
    }
    
    
     else {
      setRateIcon('/add.svg');
      setRateText('Add Review');
      setRateFunction(() => addToRating);
    
   
    }
     }, [rate]);
  
    
  
    const apiOptions = {
    method: 'GET',
    headers : {
      accept: 'application/json',
      Authorization: `Bearer ${apiKey}`
    }
  }

useEffect(() => {
      getMovieDetails();
      getCredits();
      getBackdrop();
  }, [param.id]);


  useEffect(() => {
  if (movie_ID) {
    getUserLikes();
    getUserWatchList();
    getUserDiary();
    getMovieRatings();
    getMovieLikes();
  }
}, [movie_ID]);


useEffect(() => {
  const likedMovieIds = likedMovies.map(m => m.tmdbId);
  setIsLiked(likedMovieIds.includes(Number(param.id)));
}, [likedMovies, param.id]);


useEffect(() => {
  const watchListMovieIds = watchList.map(m => m.tmdbId);
  setIsListed(watchListMovieIds.includes(Number(param.id)));
}, [watchList, param.id]);


useEffect(() => {
  const diaryMovieIds = diary.map(m => m.tmdbId);
  setIsWatched(diaryMovieIds.includes(Number(param.id)));
}, [diary, param.id]);



const getMovieLikes = async () => {
       try {
      
         if (!movie_ID) return;

         
             const response = await axios.get(`${API_URL}/movies/${movie_ID}/likeCount`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
              });

              console.log(response);
             
              setMovieLikeCount(response.data.likeCount);
             

              
              
            } catch (error) {
              console.log(error);
              
            }
          }

    const release_date = date.substring(0,4);
    const rating = vote.toFixed(1);
    
    const getCredits = async () => {
       try {
              const endpoint = `${apiUrl}/movie/${param.id}/credits`;
        
              const response = await fetch (endpoint, apiOptions);
        
              if (!response.ok) {
                throw new Error ("Failed to fetch movie credits");
              }
        
              const data = await response.json();
              
            
              if (data.Response == false) {
                setErrorMessage(data.Error || 'Failed to fetch movie credits')
                setCredits([]);
                return;
              }
        
              setCredits(data);

              setCast(data.cast);

              setDirector(data.crew[1]);
              

              
            } catch (error) {
              console.error(`Error fetching movie credits: ${error}`);
              setErrorMessage('Error fetching movie credits. Try again later');
            }
          }
  
    


    const final_cast = cast.slice(0, 4);

    const getBackdrop = async () => {
       try {
              const endpoint = `${apiUrl}/movie/${param.id}/images`;
        
              const response = await fetch (endpoint, apiOptions);
        
              if (!response.ok) {
                throw new Error ("Failed to fetch movie image");
              }
        
              const data = await response.json();
              
           
              if (data.Response == false) {
                setErrorMessage(data.Error || 'Failed to fetch movie image')
                setBackdrop([]);
                return;
              }
        
              setBackdrop(data.backdrops[0]);

              

              
            } catch (error) {
              console.error(`Error fetching movie image: ${error}`);
              setErrorMessage('Error fetching movie image. Try again later');
            }
          }
  

    const imageUrl = `https://image.tmdb.org/t/p/original/${backdrop.file_path}`
    const divStyle = {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: 'cover',
backgroundPosition: 'center',

    
  };

  const goToLogin = () => {
    navigate("/login", {
      state: {
        from: location.pathname + location.search
      }
    })
  }

  const recentRatings = rate.slice(0, 4);

  console.log(token);
  
   if (movieDetails) {
  return (
    <div className="w-full">
      
    <div className="w-full h-auto sm:h-[580px] md:h-[580px] lg:h-[580px] xl:h-[640px] bg-cover bg-center flex items-center text-white"  style={divStyle}>
      <div className="absolute inset-0 bg-black/50 z-0 h-auto sm:h-[580px] md:h-[580px] lg:h-[640px] xl:h-[640px]"></div>

      <div className="
  absolute top-0 left-0 w-full z-60 
">
      <Nav />
       </div>
      
      
            <div className="relative z-20 flex md:flex-row items-center md:items-start sm:items-start pl-8 pt-[10vh] sm:pt-29 md:pt-38 lg:pt-38 pb-30 ">
              <div className="hidden lg:block">
              <img className="max-h-[40vh] lg:max-h-[55vh] md:max-h-[65vh] sm:max-h-[10vh]" src={`https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}`} />
              <div className="flex justify-center mt-2"><img src="/liked.svg" className="w-6 h-6 mr-2" /> {movieLikeCount}</div>
              <div className="movie-rating-count"></div>
              </div>
              
              
              <div className="md:ml-8 lg:ml-12 xl:ml-16 mt-8 lg:max-w-4xl md:max-w-2xl sm:max-w-sm max-w-sm">
                <h2 className="font-bold text-4xl mb-3">{movieDetails.title}</h2>

                <div className="flex max-w-full flex-wrap">
                    {genre.map((g) => (<p className="flex flex-wrap m-1 text-white text-sm font-medium p-3 rounded-4xl" >{g.name}</p> ))} 
                    <p className="flex flex-wrap m-3">●</p>
                    <p className="flex flex-wrap m-1 text-white text-sm font-medium p-3 rounded-4xl" >{release_date}  </p>
                    <p className="flex flex-wrap m-3">●</p>
                    <p className="flex flex-wrap m-1 text-white text-sm font-medium p-3 rounded-4xl" > {movieDetails.runtime} mins</p>
                 </div>

                
                <div className="flex max-w-full flex-wrap">
                  <p className="flex flex-wrap m-1 text-white text-sm font-medium p-3 rounded-4xl bg-gradient-to-r from-blue-700 to-cyan-600" >{movieDetails.original_language}</p> 
                  <div className="flex flex-wrap m-1 text-white text-sm font-medium p-3 rounded-4xl bg-gradient-to-r from-blue-700 to-cyan-600"><img className="w-5 h-5 mr-2" src="/star.svg"/> <p className="ratings-details">{rating}</p></div>
                </div>
              
                <p className="w-full text-[2vh] lg:text-md">{movieDetails.overview}</p>
              
                <div className="cast-details">
                    <p className="text-[2vh] lg:text-md"><b>Cast: </b> </p><div className="castnames">{final_cast.map((c, index) => (
                      <span className="text-[2vh] lg:text-md" key={c.id}>
                        {c.name}
                        {index < final_cast.length - 1 && ',\u00A0'}
                      </span>
                    ))}
                    </div>
                  </div>
                   <p className="text-[2vh] lg:text-md"><b>Directed By:</b> {director.name} </p>


        
              { !token ? (
                 <div className="flex max-w-full flex-col lg:flex-row mt-2 lg:ml-auto lg:items-center lg:gap-3">
                <button className="z-99 cursor-pointer" onClick={goToLogin} ><div className="flex text-white text-[2vh] max-w-sm justify-center mb-3 lg:text-md font-medium p-3 rounded-4xl bg-gradient-to-r from-blue-700 to-cyan-600" >  <p className="m-1">Sign in to like, log, or review</p></div></button>
            </div>
            
          ) : !movie_ID  ? (
            <div className="flex gap-2 mt-2">
              <ActionSkeleton />
              <ActionSkeleton />
              <ActionSkeleton />
              <ActionSkeleton />
            </div>

          ) : (
              <div className="flex max-w-full flex-col lg:flex-row mt-2 lg:ml-auto lg:items-center lg:gap-3">
                <div className="flex text-white text-[2vh] max-w-sm justify-center mb-3 lg:text-md font-medium p-3 rounded-4xl bg-gradient-to-r from-blue-700 to-cyan-600" ><button className="z-99 cursor-pointer"  disabled={!movie_ID} onClick={toggleLike}><img className="w-8 h-8" src={`${likedIcon}`}/> </button> <p className="m-1">{likedText}</p></div>
                <div className="flex text-white text-[2vh] max-w-sm justify-center mb-3 lg:text-md font-medium p-3 rounded-4xl lg:ml-2 bg-gradient-to-r from-blue-700 to-cyan-600" ><button className="cursor-pointer" onClick={toggleList}><img className="w-8 h-8" src={`${listIcon}`}/></button> <p className="m-1"> {listText}</p> </div>
                <div className="flex text-white text-[2vh] max-w-sm justify-center mb-3 lg:text-md font-medium p-3 rounded-4xl lg:ml-2 bg-gradient-to-r from-blue-700 to-cyan-600" ><button className="cursor-pointer" onClick={toggleDiary}><img className="w-8 h-8" src={`${diaryIcon}`}/></button> <p className="m-1"> {diaryText}</p> </div>
                <div className="flex text-white text-[2vh] max-w-sm justify-center mb-3 lg:text-md font-medium p-3 rounded-4xl lg:ml-2 bg-gradient-to-r from-blue-700 to-cyan-600"><button className="cursor-pointer" onClick={openForm}><img className="w-8 h-8" src={`${rateIcon}`}/></button> <p className="m-1"> {rateText}</p> </div>
                </div>
          )}
              </div>
         

          <div className=" overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full" style={isActive ? {display: "flex"} : {display: "none"}}>
          <div class="relative p-4 w-full max-w-md max-h-full">
            
            <div class="w-full mx-auto max-w-md space-y-4 m-30 bg-gray-900 p-6 rounded-lg shadow-xs">
          <div class="flex items-center rounded-lg  pb-4 md:pb-5">
            
                <h3 class="text-xl font-semibold text-white text-heading">
                    Add your review
                </h3>
                <button type="button" onClick={openForm} class="text-body cursor-pointer bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base  text-sm w-9 h-9 ms-auto inline-flex justify-center items-center" data-modal-hide="authentication-modal">
                    <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/></svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
          <form className=" md:pt-6" onSubmit={addToRating}>
          <label className="rating-lbl">Rating:</label>
           <div style={{ display: "flex", gap: "6px", cursor: "pointer", marginBottom: "10%"}}>
  {[1, 2, 3, 4, 5].map((star) => (
    <div key={star} style={{ position: "relative", width: "32px", height: "32px" }}>
      <img
        src={
          ratings >= star
            ? fullStar
            : ratings >= star - 0.5
            ? halfStar
            : emptyStar
        }
        alt={`${star} star`}
        style={{ width: "100%", height: "100%" }}
        onClick={() => setRatings(star)}
      />
    
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "50%",
          height: "100%",
          cursor: "pointer",
        }}
        onClick={() =>
          setRatings(star - 0.5)
        }
      />
    </div>

  ))}

  
</div>

          <label className="review-lbl">Review:</label>
          <textarea rows="6" class="p-5 rounded-lg w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800" placeholder="Add review..." name="review" value={review} onChange={handleChange} />
          <input class="block w-full cursor-pointer mt-10 mb-5 rounded-lg  bg-gradient-to-r from-blue-700 to-cyan-600 px-12 py-3 text-sm font-medium text-white transition-colors hover:bg-gradient-to-r from-blue-400 to-cyan-300 " type="submit" value="Add"/>
          </form>
        </div>
          
            </div>
               </div>
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

            
              
          </div>
          <div>
             

             <div className="mt-16 text-white">
  

  <h2 className="text-4xl font-bold text-center mb-10">
    Ratings for This Film
  </h2>


  <div className="max-w-4xl mx-auto flex flex-col gap-6">
    {recentRatings?.length > 0 ? (
      recentRatings.map(r => (
        <RatingCard
          key={r._id}
          rating={r}
          tmdbId={param.id}
        />
      ))
    ) : (
      <p className="text-center text-gray-400 mb-8">
        No reviews yet. Be the first to rate this film.
      </p>
    )}
  </div>
  </div>
            
           </div>

           <center>
              {recentRatings?.length > 0 && (
                <a className="mt-10 mb-10 bg-gradient-to-r from-blue-700 to-cyan-600 w-sm rounded-4xl p-5 to-blue-700 text-white"
                  style={{ display: "flex", justifyContent: "center" }} 
                  href={`/all_ratings/${movie_ID}/`}
                >
                  Check all reviews for this movie.
                </a>
              )}
            </center>
         </div>

         
 
  )
      
  } else {
    return (
    <div className="bg-black h-screen flex items-center justify-center">
      <center>
          <img className="spinner" src="../Spinner.svg"/>
          </center>
    </div>
    )
  }
}

      
      


export default MovieDetails