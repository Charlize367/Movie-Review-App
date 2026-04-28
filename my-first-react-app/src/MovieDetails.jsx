
import { Form, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react'
import Nav from './components/Nav.jsx'
import axios from 'axios';
import ActionSkeleton from './components/ActionSkeleton.jsx';
import RateMovieForm from './components/RateMovieForm.jsx';
import MovieRatings from './components/MovieRatings.jsx';
import { getCredits, getMovieDetails, getMovieLikes, toggleMovieLike, getUserWatchlist, getMovieRatings } from './services/api.js';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const MovieDetails = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('jwtToken');
  const param = useParams();
  const userId = localStorage.getItem('user_ID'); 
  const [watchList, setWatchList] = useState([]);
  const [rate, setRate] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [movieLikeCount, setMovieLikeCount] = useState(0);
  const [movie_ID, setMovie_ID] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [likes, setLikes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isCurrentlyLiked = likes.includes(userId);
  const likedIcon = isCurrentlyLiked ? "/liked.svg" : "/like.svg"; 
  const likedText = isCurrentlyLiked ? "Liked" : "Like";
  const isCurrentlyListed = watchList.includes(userId);
  const listIcon = isCurrentlyListed ? '/listed.svg' : '/add.svg';
  const listText = isCurrentlyListed ? 'Saved' : 'List';
 

  const queryClient = useQueryClient();

  useEffect(() => {
    if (location.state?.popup) {
      setPopupMessage(location.state.popup);
      setShowPopup(true);
  
      setTimeout(() => setShowPopup(false), 3000);
    }
  }, []);
   
  const movieId = param.id
  const { data: movieDetails } = useQuery({
    queryKey: ['movieDetails', movieId],
    queryFn: () => getMovieDetails(movieId),

    enabled: !!movieId
  });

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


  const { data: movieLikes } = useQuery({
    queryKey: ['movieLikes', movie_ID],
    queryFn: () => getMovieLikes(movie_ID),

    enabled: !!movie_ID
  });

  console.log("Movie likes: ", movieLikes);
  
  const { data: userWatchlist } = useQuery({
    queryKey: ['watchlist', userId],
    queryFn: () => getUserWatchlist(userId),

    enabled: !!userId
  });

  

  

  // const getMovieLikes = async () => {
  //       try {
        
  //         if (!movie_ID) return;

          
  //             const response = await axios.get(`${API_URL}/movies/${movie_ID}/likes`, {
  //                   headers: {
  //                       'Content-Type': 'application/json',
  //                       'Authorization': `Bearer ${token}`
  //                   }
  //               });

  //               console.log(response);
              
  //               setMovieLikeCount(response.data.count);
  //               setLikes(response.data.likes);
              

                
                
  //             } catch (error) {
  //               console.log(error);
                
  //             }
  // }
 
  
 
  // const getUserWatchList = async () => {
  //       try {
  //             const response = await axios.get(`${API_URL}/users/${userId}/watchlist`, {
  //                   headers: {
  //                       'Content-Type': 'application/json',
  //                       'Authorization': `Bearer ${token}`
  //                   }
  //               });

  //               console.log(response);
  //               setWatchList(response.data.watchListMovies);

  //             } catch (error) {
  //               console.log(error);
                
  //             }
  // }

      
  const toggleLike = async(e) => {
        e.preventDefault();

        if(!movie_ID) return;

        const previousLikes = [...likes];
        const previousCount = movieLikeCount;

        const willBeLiked = !isCurrentlyLiked;

        setLikes(prev =>
          willBeLiked ? [...prev, userId] : prev.filter(id => id !== userId)
        );

        setMovieLikeCount(prev => willBeLiked ? prev + 1 : prev - 1);
        
            try {
              
              const response = await axios.post(`${API_URL}/watch/liked/${userId}/${movie_ID}`, {}, {
                headers: { 
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json' 
                }
              });

              console.log(response);
              console.log("Transaction Success:", response.data.action);

        } catch (error) {
        console.error("Transaction failed or timed out:", error);
      
          setLikes(previousLikes);
          setMovieLikeCount(previousCount);
        }
        
  }
// MUTATE DOESNT WORK COME BACK HERE

  const likeMutation = useMutation({
    mutationFn: ({ userId, movie_ID }) => {
    console.log("SENT TO API: Hitting toggleMovieLike now!"); 
    return toggleMovieLike(userId, movie_ID);
  },
    
    onMutate: async (variables) => {
      console.log("1. onMutate started");

      if (!variables.movie_ID || !variables.userId) {
       console.error("❌ SHUTTING DOWN: mutate() called with missing data", variables);
       return; 
    }

      try {
      await queryClient.cancelQueries({ queryKey: ['movieLikes', variables.movie_ID ]});

      const previousLikes = queryClient.getQueryData(['movieLikes', variables.movie_ID ]);

      
      queryClient.setQueryData(['movieLikes', variables.movie_ID ], (prev) => {
        const likeArray = prev?.data;
        const isCurrentlyLiked = likeArray?.some(likes =>
        (likes.userId === variables.userId ));

        console.log("Like array: ", likeArray);

        
        
        
        return{
          ...prev,
          count: isCurrentlyLiked ? likeArray?.count - 1 : likeArray?.count + 1,
          likes: isCurrentlyLiked
                ? likeArray.filter(likes => likes.userId !== variables.userId)
                : [...likeArray, {userId: variables.userId, movieId: variables.movie_ID}]
        };
      });
      return { previousLikes }
    } catch (err) {
      console.error("THE CRASH HAPPENED HERE", err);
      throw err;
    }
    },

    onError: (err, variables, context) => {
      console.error("❌ CRITICAL FAILURE:", err.message);
   
    if (context?.previousLikes) {
      queryClient.setQueryData(['movieLikes', variables.movie_ID], context.previousLikes);
    }
   
  },

  onSettled: (data, error, variables) => {
  console.log("Settling with variables:", variables);
  queryClient.invalidateQueries({ queryKey: ['movieLikes', variables.movie_ID] });
},
    



  })
    

  const toggleList = async (e) => {

        e.preventDefault();

        if(!movie_ID) return;

        const previousList = [...watchList];
      
        const willBeListed = !isCurrentlyListed;

        setWatchList(prev =>
          willBeListed ? [...prev, userId] : prev.filter(id => id !== userId)
        );

        let message = "";

        try {

            const response = await axios.post(`${API_URL}/watch/watchlist/${userId}/${movie_ID}`, {}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
            });

            console.log(response);
            console.log("Transaction Success:", response.data.action);

        
          if(response.data.action === "removed from") {
            message =  "🎬 Movie removed from your watchlist"
          } else {
            message =  "🎬 Movie added to your watchlist"
          }

        setShowPopup(true);
        setPopupMessage(message);

        setTimeout(() => setShowPopup(false), 3000);
        

        } catch (error) {
          console.error("Transaction failed or timed out:", error);
          setWatchList(previousList);
        }
  }

      console.log("Watchlist: ", watchList);
      console.log("Likes: ", likes);


  const { data: movieRatings } = useQuery({
    queryKey: ['movieRatings', movie_ID],
    queryFn: () => getMovieRatings(movie_ID),

    enabled: !!movie_ID
  });


  console.log("User watchlist: ", userWatchlist);
  console.log("Movie ratings: ", movieRatings);
  

  // const getMovieRatings = async () => {
  //       try {

  //         if (!movie_ID) return;

  //             const response = await axios.get(`${API_URL}/ratings/movieRatings/${movie_ID}`, {
  //                   headers: {
  //                       'Content-Type': 'application/json',
                        
  //                   }
  //               });

  //               console.log(response);
  //               setRate(response.data.data);
  //               setIsLoading(false);
                
             
  //             } catch (error) {
  //               console.log(error);
                
  //             }
  // }

  const openForm = () => {
      setIsActive(!isActive);
      
  }
               

    

  useEffect(() => {
    if (movie_ID) {
      
    
      getMovieRatings();
     
      
    }
  }, [movie_ID]);


  const { data: credits } = useQuery({
    queryKey: ['credits', movieId],
    queryFn: () => getCredits(movieId),

    enabled: !!movieId
  });
    

  const final_cast = credits?.cast.slice(0, 4);

    console.log(final_cast);


  const imageUrl = `https://image.tmdb.org/t/p/original/${movieDetails?.backdrop_path}`
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


  console.log(token);

   const release_date = movieDetails?.release_date?.substring(0,4);
  const rating = movieDetails?.vote_average?.toFixed(1);

  

  const isLiked = movieLikes?.data?.some(likes =>
        (likes.userId === userId ));
  
   if (movieDetails && credits) {
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
                    {movieDetails?.genres.map((g) => (<p className="flex flex-wrap m-1 text-white text-sm font-medium p-3 rounded-4xl" >{g.name}</p> ))} 
                    <p className="flex flex-wrap m-3">●</p>
                    <p className="flex flex-wrap m-1 text-white text-sm font-medium p-3 rounded-4xl" >{release_date}  </p>
                    <p className="flex flex-wrap m-3">●</p>
                    <p className="flex flex-wrap m-1 text-white text-sm font-medium p-3 rounded-4xl" > {movieDetails.runtime} mins</p>
                    
                 </div>

                
                <div className="flex max-w-full flex-wrap">
                   
                  <div className="flex flex-wrap text-white text-sm font-medium p-3 rounded-4xl "><img className="w-5 h-5 mr-2" src="/star.svg"/> <p className="ratings-details">{rating}</p></div>
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
                   <p className="text-[2vh] lg:text-md"><b>Directed By:</b> {credits?.crew[1].name} </p>


        
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
                {/* <div className="flex text-white text-[2vh] max-w-sm justify-center mb-3 lg:text-md font-medium p-3 rounded-4xl bg-gradient-to-r from-blue-700 to-cyan-600" ><button className="z-99 cursor-pointer"  disabled={!movie_ID} onClick={toggleLike}><img className="w-8 h-8" src={`${likedIcon}`}/> </button> <p className="m-1">{likedText}</p></div> */}
                <div className="flex text-white text-[2vh] max-w-sm justify-center mb-3 lg:text-md font-medium p-3 rounded-4xl bg-gradient-to-r from-blue-700 to-cyan-600" ><button 
  onClick={(e) => {
    e.preventDefault(); // 👈 ADD THIS LINE
    e.stopPropagation(); // Prevents the click from bubbling up
    
    if (!userId || !movie_ID) {
      console.error("Missing IDs", { userId, movie_ID });
      return;
    }

    likeMutation.mutate({ userId, movie_ID });
  }}
  disabled={likeMutation.isPending} 
  className={`btn ${isLiked ? 'active' : ''}`}
>
                  <img className="w-8 h-8" src={isLiked ? "/liked.svg" : "/like.svg"}/>
                
                </button> <p className="m-1">{isLiked ? "Liked" : "Like"}</p></div>
                <div className="flex text-white text-[2vh] max-w-sm justify-center mb-3 lg:text-md font-medium p-3 rounded-4xl lg:ml-2 bg-gradient-to-r from-blue-700 to-cyan-600" ><button className="cursor-pointer" onClick={toggleList}><img className="w-8 h-8" src={`${listIcon}`}/></button> <p className="m-1"> {listText}</p> </div>
                <div className="flex text-white text-[2vh] max-w-sm justify-center mb-3 lg:text-md font-medium p-3 rounded-4xl lg:ml-2 bg-gradient-to-r from-blue-700 to-cyan-600"><button className="cursor-pointer" onClick={openForm}><img className="w-8 h-8" src={`/add.svg`}/></button> <p className="m-1">Add Review</p> </div>
                </div>
          )}
              </div>
         

          <div className=" overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full" style={isActive ? {display: "flex"} : {display: "none"}}>
          <div class="relative p-4 w-full max-w-md max-h-full">
            
          <RateMovieForm openForm={openForm}/>
          
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
   
           <MovieRatings rate={rate} tmdbId={param.id} movie_ID={movie_ID} isLoading={isLoading} />
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