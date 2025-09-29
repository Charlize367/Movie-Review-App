import React from 'react'
import { Form, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react'
import Nav from './components/Nav.jsx'
import axios from 'axios';
import emptyStar from "/star1.svg";
import halfStar from "/halfStar.svg";
import fullStar from "/star2.svg";
import RatingCard from './RatingCard.jsx';


const MovieDetails = () => {
  const API_URL = 'http://localhost:3000/api/v1';
  const apiUrl =  'https://api.themoviedb.org/3';
  const apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ODI1MGEyNjQ5YTAwYTk2OTdlYjIxMGUzMTExZGE1YyIsIm5iZiI6MTcyMjU4NzAzNS43MTYsInN1YiI6IjY2YWM5NzliNTEyMTNhZjA5MWJkNThhMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.zrM-3dtjvwa-al-qRd70tlGRD0VkxCFbHgYmZEzY6gA';
  const token = localStorage.getItem('jwtToken');
  const [movieDetails, setMovieDetails] = useState([]);
  const [vote, setVote] = useState(0);
  const [date, setDate] = useState("");
  const [credits, setCredits] = useState([]);
  const [cast, setCast] = useState([]);
  const [genre, setGenre] = useState([]);
  const [director, setDirector] = useState([]);
  const [backdrop, setBackdrop] = useState([]);
  const param = useParams();
  const [movies, setMovies] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('user_ID');
  const [likedMovies, setLikedMovies] = useState([]);
  const [likedIcon, setlikedIcon] = useState('');
  const [likedText, setLikedText] = useState("");
  const [likeFunction, setLikeFunction] = useState(() => () => {});
  const [watchList, setWatchList] = useState([]);
  const [listIcon, setListIcon] = useState('');
  const [listText, setListText] = useState("");
  const [listFunction, setListFunction] = useState(() => () => {});
  const [diary, setDiary] = useState([]);
  const [diaryIcon, setDiaryIcon] = useState('');
  const [diaryText, setDiaryText] = useState("");
  const [diaryFunction, setDiaryFunction] = useState(() => () => {});
  const [rate, setRate] = useState([]);
  const [rateIcon, setRateIcon] = useState('');
  const [rateText, setRateText] = useState("");
  const [rateFunction, setRateFunction] = useState(() => () => {});
  const [isActive, setIsActive] = useState(false);
  const [inputData, setInputData] = useState([]);
  const [ratings, setRatings] = useState(0);
  const [review, setReview] = useState("");
  const [movieLikeCount, setMovieLikeCount] = useState(0);
  const [movie_ID, setMovie_ID] = useState(0);
  const [test, setTest] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
 
  
   

  

              

  
  const getMovies = async () => {
       try {
             const response = await axios.get(`${API_URL}/movies`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
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
  }, []);

   const getMovieByTmdbId = async () => {

    
       try {
             const response = await axios.get(`${API_URL}/movies/${param.id}/tmdbId`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
              });

              console.log(response);
              setMovie_ID(response.data.data._id);

              
            } catch (error) {
              console.log(error);
              
            }
          }
  useEffect(() => {
      getMovieByTmdbId();
  }, []);

  
  
        

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
  
      useEffect(() => {
      getUserLikes();
      
    }, []);

    

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
  
      useEffect(() => {
      getUserWatchList();
      
    }, []);


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
  
      useEffect(() => {
      getUserDiary();
      
    }, []);

    

  const addMovieIfNotExists = async () => {
     
    
    const inputData = {
      'tmdbId' : param.id,
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


              const movie_ID = response.data.exists === false 
                ? response.data.data._id
                : response.data.data._id;


                return movie_ID
          
          } 


    

    console.log(token);


    const addToMovieLike = async(e) => {
      
      e.preventDefault();

      try {

        const movieId = await addMovieIfNotExists();

        const response = await axios.post(`${API_URL}/users/${userId}/${movieId}/likes`, {}, {
            headers : {
              'Content-Type' : 'application/json',
              'Authorization': `Bearer ${token}`
            }
        });

        console.log(response);

        getUserLikes();
        getMovieLikes();

      } catch (error) {
        console.log(error);
      }

  }


  const removeLike = async(e) => {
    e.preventDefault();
    
     try {
      const selectedLikedMovie = likedMovies.find(movie => movie.tmdbId === Number(param.id));
      const selectedMovie = movies.find(movie => movie.tmdbId === Number(param.id));

      const likeId = selectedLikedMovie._id;
      const movieId = selectedMovie._id;
          const response = await axios.delete(`${API_URL}/users/${userId}/${likeId}/${movieId}/like`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
                });
                
                console.log(response);
                console.log(likeId);
                console.log(movieId);
                getUserLikes();
                getMovieLikes();
                
                
        
      } catch (error) {
      console.log(error);
    }
  }


    const addToWatchList = async(e) => {
      e.preventDefault();
      try {
         const movieId = await addMovieIfNotExists();
          const response = await axios.post(`${API_URL}/users/${userId}/${movieId}/watchlist`, {}, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
                });
                
                console.log(response);
                console.log(movieId);
                getUserWatchList();
                
        
      } catch (error) {
      console.log(error);
    }
  }


  const removeList = async(e) => {
    e.preventDefault();
    
     try {
      const selectedListMovie = watchList.find(movie => movie.tmdbId === Number(param.id));
      const selectedMovie = movies.find(movie => movie.tmdbId === Number(param.id));

      const listId = selectedListMovie._id;
      const movieId = selectedMovie._id;
          const response = await axios.delete(`${API_URL}/users/${userId}/${listId}/watchlist`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
                });
                
                console.log(response);
                console.log(listId);
                console.log(movieId);
                getUserWatchList();
                
                
        
      } catch (error) {
      console.log(error);
    }
  }


  const handleChange = (e) => {
  setReview(e.target.value);
};

  const openForm = () => {
    setIsActive(!isActive);
    
  }



    const addToDiary = async(e) => {
     
      e.preventDefault();
      

      try {
         const movieId = await addMovieIfNotExists();
          const response = await axios.post(`${API_URL}/users/${userId}/${movieId}/diary`, {},  {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
                });
                
                console.log(response);
                console.log(movieId);
                getUserDiary();

        
      } catch (error) {
      console.log(error);
    }
  }


  const addToRating = async(e) => {
     
      e.preventDefault();

      try{
        const movieId = await addMovieIfNotExists();

        const finalData = {
          rating: ratings,
          review: review,
          userId: userId,
          movieId: movieId
        };


        const response = await axios.post(`${API_URL}/ratings`, finalData, {
          headers : {
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        console.log(response);

                setShowPopup(true);


         setTimeout(() => setShowPopup(false), 3000);

        openForm(!isActive);
        e.target.reset();
        getMovieRatings();
      } catch (error) {
        console.log(error);
      }
    }



  const removeDiary = async(e) => {
    e.preventDefault();
    
     try {
      const selectedDiary = diary.find(movie => movie.tmdbId === Number(param.id));
      const selectedMovie = movies.find(movie => movie.tmdbId === Number(param.id));

      const diaryId = selectedDiary._id;
      const movieId = selectedMovie._id;
          const response = await axios.delete(`${API_URL}/users/${userId}/${diaryId}/diary`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
                });
                
                console.log(response);
                console.log(diaryId);
                console.log(movieId);
                getUserDiary();
                
                
        
      } catch (error) {
      console.log(error);
    }
  }

  const getMovieRatings = async () => {
       try {

        const movieID = await addMovieIfNotExists();
        console.log(movieID);
             const response = await axios.get(`${API_URL}/ratings/movieRatings/${movieID}`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
              });

              console.log(response);
              setRate(response.data);
              
              
  
              
            } catch (error) {
              console.log(error);
              
            }
          }

          
  
      useEffect(() => {
      getMovieRatings();
      
    }, []);
      

    console.log(rate);
   


  useEffect(() => {

    const selectedLikedMovie = likedMovies.find(movie => movie.tmdbId === Number(param.id))
     

    if(selectedLikedMovie) {
      
      
      setlikedIcon('/liked.svg');
      setLikedText('Liked');
      setLikeFunction(() => removeLike);
      
    }
    
    
     else {
      setlikedIcon('/like.svg');
      setLikedText('Like');
      console.log('like');
      setLikeFunction(() => addToMovieLike);
    
   
    }
     }, [likedMovies]);





  useEffect(() => {

    const selectedListMovie = watchList.find(movie => movie.tmdbId === Number(param.id))
     

    if(selectedListMovie) {
      
     
      setListIcon('/listed.svg');
      setListText('Saved');
      console.log("listed");
      setListFunction(() => removeList);
      
    }

     else {
      setListIcon('/add.svg');
      setListText('List');
      console.log("not listed");
      setListFunction(() => addToWatchList);
    
   
    }
     }, [watchList]);

  
  useEffect(() => {

    const selectedDiary = diary.find(movie => movie.tmdbId === Number(param.id))
     

    if(selectedDiary) {
      
      
      setDiaryIcon('/watched.svg');
      setDiaryText('Watched');
      setDiaryFunction(() => removeDiary);
      
    }
    
    
     else {
      setDiaryIcon('/watch.svg');
      setDiaryText('Mark');
      setDiaryFunction(() => addToDiary);
    
   
    }
     }, [diary]);


  


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
  
    
  console.log(API_URL);
  console.log(likeFunction);
  
  console.log(userId);
  const apiOptions = {
  method: 'GET',
  headers : {
    accept: 'application/json',
    Authorization: `Bearer ${apiKey}`
  }
}


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

useEffect(() => {
  getMovieDetails();
}, [param.id])


const getMovieLikes = async () => {
       try {

         const movieID = await addMovieIfNotExists();
             const response = await axios.get(`${API_URL}/movies/${movieID}/likeCount`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
              });

              console.log(response);
              console.log(movieID);
              setMovieLikeCount(response.data.likeCount);

              
              
            } catch (error) {
              console.log(error);
              
            }
          }
  
      useEffect(() => {
      getMovieLikes();
      
    }, []);


   



     



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
  
          useEffect(() => {
      getCredits();
    }, [param.id]);


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
  
          useEffect(() => {
      getBackdrop();
    }, []);

    const imageUrl = `https://image.tmdb.org/t/p/original/${backdrop.file_path}`
    const divStyle = {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: 'cover', 
    backgroundRepeat: 'no-repeat', 
    backgroundPosition:'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backgroundBlendMode: 'darken',
    height: '85vh', 
    width: 'auto',
    marginTop: '-3%',
    paddingTop:'3%',
    paddingLeft:'3%',
    marginLeft: '-3%',
    marginRight: '-3%'
  };

  const recentRatings = rate.slice(0, 4);

  console.log(movie_ID);
  console.log(test);
 

   console.log(movieLikeCount);
  return (
    <div>
    <div className="container"  style={divStyle}>
      <Nav />
      <div className="movie-detail-hero" >
    
      </div>
          <div className="movie-details">
            <div className="primary-details">
              <div className="img-like-rating-counts">
              <img className="movie-img-container" src={`https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}`} />
              <div className="movie-like-count"><img src="/liked.svg" className="movieLikeIcon" /> {movieLikeCount}</div>
              <div className="movie-rating-count"></div>
              </div>
              
              
              <div className="movie-main-info">
                <h2 className="movie-detail-title">{movieDetails.title}</h2>

                <div className="movie-subdetail1">
                    {genre.map((g) => (<p className="genre-details">{g.name}</p> ))} 
                    <p className="dot">●</p>
                    <p className="movie-detail-date">{release_date}  </p>
                    <p className="dot">●</p>
                    <p className="runtime-details"> {movieDetails.runtime} mins</p>
                 </div>

                
                <div className="movie-subdetail2">
                  <p className="movie-detail-lang">{movieDetails.original_language}</p> 
                  <div className="rating-details"><img className="rate-icon" src="/star.svg"/> <p className="ratings-details">{rating}</p></div>
                </div>
              
                <p className="movie-detail-overview">{movieDetails.overview}</p>
              
                <div className="cast-details">
                    <p className="movie-detail-cast"><b>Cast: </b> </p><div className="castnames">{final_cast.map((c, index) => (
                      <span key={c.id}>
                        {c.name}
                        {index < final_cast.length - 1 && ',\u00A0'}
                      </span>
                    ))}
                    </div>
                  </div>
                   <p className="director-details"><b>Directed By:</b> {director.name} </p>

              <div className="movie-actions">
                <div className="movie-detail-like"><button className="likeBtn" onClick={likeFunction}><img className="liked-icon" src={`${likedIcon}`}/> </button> <p className="like-txt">{likedText}</p></div>
                <div className="movie-detail-list"><button className="listBtn" onClick={listFunction}><img className="addToList-icon" src={`${listIcon}`}/></button> <p className="list-txt"> {listText}</p> </div>
                <div className="movie-detail-diary"><button className="diaryBtn" onClick={diaryFunction}><img className="addToList-icon2" src={`${diaryIcon}`}/></button> <p className="diary-txt"> {diaryText}</p> </div>
                <div className="movie-detail-rating"><button className="ratingBtn" onClick={openForm}><img className="addToList-icon2" src={`${rateIcon}`}/></button> <p className="rate-txt"> {rateText}</p> </div>
                

              </div>
            </div>

          <div className="logForm" style={isActive ? {display: "flex"} : {display: "none"}}>
          <h2>Log Film</h2>
          <button className="closeBtn" onClick={openForm}>x</button>
          <form className="log-form" onSubmit={addToRating}>
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
          <textarea className="review_field"  placeholder="Add review..." name="review" value={review} onChange={handleChange} />
          <input className="logBtn" type="submit" value="Add"/>
          </form>
        </div>
         
              </div>
              </div>
            </div>

{showPopup && (
            <div className="add-popup">
              Rating added successfully.
            </div>
              )}

            
              <div id="#testimonials">
                <div class="testimonial-heading">
                    <h2>Ratings For This Film</h2>
              <div class="testimonial-box-container">
                
              {recentRatings.map((r) => { 
                
               
                return(
                
            <RatingCard rating={r} tmdbId = {param.id}/>
            
           
          )
      
           
        }
             
             
              )}
            </div>
        
          </div>
         
          </div>
          <div>
             <center>
              {recentRatings?.length > 0 && (
                <a 
                  style={{ display: "flex", justifyContent: "center" }} 
                  href={`/all_ratings/${movie_ID}/`}
                >
                  Check all reviews for this movie.
                </a>
              )}
            </center>

            {recentRatings?.length === 0 && (
              <p style={{ display: "flex", justifyContent: "center" }}>
                Be the first to rate this film.
              </p>
            )}
           </div>
         </div>
 
  )
      
  
}

      
      


export default MovieDetails