import React from 'react'
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react'
import Nav from './components/Nav.jsx'
import axios from 'axios';


const MovieDetails = () => {
  const API_URL = 'http://localhost:3000/api/v1';
  const apiUrl =  'https://api.themoviedb.org/3';
  const apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ODI1MGEyNjQ5YTAwYTk2OTdlYjIxMGUzMTExZGE1YyIsIm5iZiI6MTcyMjU4NzAzNS43MTYsInN1YiI6IjY2YWM5NzliNTEyMTNhZjA5MWJkNThhMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.zrM-3dtjvwa-al-qRd70tlGRD0VkxCFbHgYmZEzY6gA';

  const [movieDetails, setMovieDetails] = useState([]);
  const [vote, setVote] = useState(0);
  const [date, setDate] = useState("");
  const [credits, setCredits] = useState([]);
  const [cast, setCast] = useState([]);
  const [genre, setGenre] = useState([]);
  const [director, setDirector] = useState([]);
  const [backdrop, setBackdrop] = useState([]);
  const param = useParams();
  const [movie, setMovie] = useState([]);
  const [movies, setMovies] = useState([]);
  const [movieId, setMovieId] = useState(0);
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('user_ID');
  const [isActive, setIsActive] = useState(false);
  


  console.log(API_URL);
  
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

    const getMovies = async () => {
       try {
             const response = await axios.get(`${API_URL}/movies`, {
                  headers: {
                       'Content-Type': 'application/json'
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

    

    const imageUrl = `https://image.tmdb.org/t/p/original/${backdrop.file_path}`
    const divStyle = {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: 'cover', 
    backgroundRepeat: 'no-repeat', 
    backgroundPosition:'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backgroundBlendMode: 'darken',
    height: 'auto', 
    width: 'auto'
  };




  const addToMovieLike = async (e) => {
    e.preventDefault();

    

    const inputData = {
      'tmdbId' : param.id,
      'title' : movieDetails.title,
      'posterPath' : movieDetails.poster_path,
      'releaseDate' : movieDetails.release_date,
      'likedBy' : [],
      'ratings' : []
    }

    try {

            const response = await axios.post(`${API_URL}/movies`, inputData, {
                  headers: {
                       'Content-Type': 'application/json'
                  }
              });

              console.log(response);

              let movieID = 0;
              if (response.data.exists == false) {
              movieID = response.data.data._id;
              }
              
              if (response.data.exists == true) {
               console.log("movie exists");
               console.log(movies);
               console.log(param.id);
               
                const selectedMovie = movies.find(movie => movie.tmdbId === Number(param.id))
                movieID = selectedMovie._id;
                console.log(selectedMovie);
                
                

              }

            

               likeMovie(movieID);
            } catch (error) {
              console.log(error);
            }
          } 


    const likeMovie = async(movieId) => {
      try {
          const response2 = await axios.post(`${API_URL}/users/${userId}/${movieId}/likes`, {
                  headers: {
                       'Content-Type': 'application/json'
                  }
                });
                
                console.log(response2);
                console.log(movieId);
                setIsActive(true);
        
      } catch (error) {
      console.log(error);
    }
  }


  console.log(movies);

  

  return (
    <body style={divStyle}>
    <div className="container">
      <Nav />
      <div className="movie-detail-hero" >
        {/*<img className="movie-detail-hero" src={`https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}`} />*/}
      </div>
          <div className="movie-details">
            <div className="primary-details">
              <img className="movie-img-container" src={`https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}`} />
              
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
                <div className="movie-detail-like"><button className="likeBtn" onClick={addToMovieLike}><img className="liked-icon" src="/like.svg"/> </button> <p className="like-txt">Like</p></div>
                <div className="movie-detail-list"><button className="listBtn"><img className="addToList-icon" src="/add.svg"/></button> <p className="list-txt"> List</p> </div>
                <div className="movie-detail-diary"><button className="diaryBtn"><img className="addToList-icon" src="/add.svg"/></button> <p className="diary-txt"> Diary</p> </div>

              </div>
            </div>

              
                  
                    
                  
                
              </div>

            

              </div>

              

            </div>

          </body>
            

         
      
  )
      
}

      
      


export default MovieDetails