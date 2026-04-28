import React from 'react'
import { useState, useEffect } from 'react';
import Nav from './components/Nav';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"
import MovieCard from './components/MovieCard';

const Profile = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [isLoading, setIsLoading] = useState(true);
    const param = useParams();
    const [user, setUser] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [likedMovies, setLikedMovies] = useState([]);
    const [diary, setDiary] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    const [movieLists, setMovieLists] = useState([]);
    const [followers, setFollowers] = useState([]);
    const token = localStorage.getItem('jwtToken');
    const userId = localStorage.getItem('user_ID');
    const username = localStorage.getItem('username');
    const [following, setFollowing] = useState([]);
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [followersOpen, setFollowersOpen] = useState(false);
    const [followingOpen, setFollowingOpen] = useState(false);

    
   
    dayjs.extend(relativeTime);

    const getUser = async () => {
       try {
             const response = await axios.get(`${API_URL}/users/${param.id}`, {
                  headers: {
                       'Content-Type': 'application/json',
                  }
              });

              console.log(response);
              setUser(response.data.data);
              setIsLoading(false);
              
              
            } catch (error) {
              console.log(error);
             
              
            }
          }
  
     

    const getUserLikes = async () => {
       try {
             const response = await axios.get(`${API_URL}/users/${param.id}/likedMovies`, {
                  headers: {
                       'Content-Type': 'application/json',
                       
                  }
              });

              console.log(response);
              setLikedMovies(response.data.likedMovies);
              setIsLoading(false);
              
              
            } catch (error) {
              console.log(error);
             
              
            }
          }
  
      
    const getUserRatings = async () => {
       try {

       
             const response = await axios.get(`${API_URL}/ratings/userRatings/${param.id}`, {
                  headers: {
                       'Content-Type': 'application/json',
                       
                  }
              });

              console.log(response);
              setRatings(response.data);
             
              
              
  
              
            } catch (error) {
              console.log(error);
              
            }
          }

       const getWatchList = async () => {
       try {
             const response = await axios.get(`${API_URL}/users/${param.id}/watchlist`, {
                  headers: {
                       'Content-Type': 'application/json',
                       
                  }
              });

              console.log(response);
              setWatchlist(response.data.watchListMovies);
              setIsLoading(false);

              
              
            } catch (error) {
              console.log(error);
              
              
            }
          }
      
      const getDiary = async () => {
       try {
             const response = await axios.get(`${API_URL}/users/${param.id}/diary`, {
                  headers: {
                       'Content-Type': 'application/json',
                       
                  }
              });

              console.log(response);
              setDiary(response.data.diary);
              setIsLoading(false);

              
              
            } catch (error) {
              console.log(error);
              
              
            }
          }

      const getMovieLists = async () => {
       try {

       
             const response = await axios.get(`${API_URL}/movieList/${param.id}`, {
                  headers: {
                       'Content-Type': 'application/json',
                       
                  }
              });

              console.log(response);
              setMovieLists(response.data.data);
              setIsLoading(false);
              
              
  
              
            } catch (error) {
              console.log(error);
              
            }
          }

      const getFollowers = async () => {
       try {

       
             const response = await axios.get(`${API_URL}/users/${param.id}/followers`, {
                  headers: {
                       'Content-Type': 'application/json',
                       
                  }
              });

              console.log(response);
              setFollowers(response.data.followers.followers);
              setFollowerCount(response.data.count);
              
            } catch (error) {
              console.log(error);
              
            }
          }
      

     const addFollowing = async () => {
       try {
             const response = await axios.post(`${API_URL}/users/${userId}/follower/${user._id}/following`, {},  {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
              });

              console.log(response);
              if(response) {
              console.log("Followed success!");
              }
            
            } catch (error) {
              console.log(error);
              
            }
          }

      const getFollowing = async () => {
       try {

       
             const response = await axios.get(`${API_URL}/users/${param.id}/following`, {
                  headers: {
                       'Content-Type': 'application/json',
                       
                  }
              });

              console.log(response);
              setFollowing(response.data.following.following);
              setFollowingCount(response.data.count);
              
              
             
          
            } catch (error) {
              console.log(error);
              
            }
          }
      

console.log(followers);
    const toggleFollow = async(e) => {
      e.preventDefault()

      const existingFollower = followers.find(follower => follower._id === userId);
      const newFollowState = !existingFollower;

      
      setFollowerCount(prev => newFollowState ? prev + 1 : prev - 1);
          setFollowers(prev =>
      newFollowState
        ? [...prev, { _id: userId, username: username }]
        : prev.filter(follower => follower._id !== userId)
    );
      try {
        
        if(newFollowState) {

          await axios.post(`${API_URL}/users/${userId}/follower/${user._id}/following`, {},  {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
          });
 

        } else {

          await axios.delete(`${API_URL}/users/${userId}/follower/${user._id}/following`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
                });
      
               
        }



      } catch (error) {
        console.log(error);
        
        
      setFollowerCount(prev => newFollowState ? prev - 1 : prev + 1);
      setFollowingCount(prev => newFollowState ? prev - 1 : prev + 1);
      }
      
    }
  
    useEffect(() => {
      getUser();
      getUserLikes
      getUserRatings();
      getWatchList();
      getDiary();
      getMovieLists();
      getFollowers();
      getFollowing();
      
    }, [param.id]);

   const isFollowed = followers.some(f => f._id === userId);
  const followIcon = isFollowed ?  '' : '+';
  const followText = isFollowed ? 'Followed' : 'Follow';

     console.log("Following :", following, "Following count: ", followingCount);
     console.log("Followers :", followers, "Follower count: ", followerCount);
console.log(followers);
console.log(user);
  return (
    <div>
       <Nav />
      {isLoading ? (
            <center>
          <img className="spinner" src="/Spinner.svg"/>
          </center>
       
      ) : (
<div class="relative max-w-md mx-auto md:max-w-2xl mt-6 min-w-0 break-words bg-white/10 backdrop-blur-md border border-white/20 
                hover:-translate-y-1 
                hover:shadow-2xl hover:shadow-blue-900/40 
                transition duration-300 w-full mb-6 shadow-lg rounded-xl mt-16">
    <div class="px-6">
        <div class="flex flex-wrap justify-center">
            <div class="w-full flex justify-center">
                <div class="relative">
                    <img src={`${API_BASE_URL}/${user.image}`}  class="shadow-xl rounded-full align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-[150px]"/>
                </div>
            </div>
            <div class="w-full flex justify-center text-center mt-20">
                <div class="flex justify-center lg:pt-4 pt-8 pb-0">
                    <div class="p-3 text-center">
                        <span class="text-xl font-bold block uppercase tracking-wide text-white">3,360</span>
                        <span class="text-sm text-slate-400">Reviews</span>
                    </div>
                    <div class="p-3 text-center">
                        <button onClick={setFollowersOpen} class="text-xl cursor-pointer font-bold block uppercase tracking-wide text-white">{followerCount}</button>
                        <span class="text-sm text-slate-400">Followers</span>
                    </div>
                    <div class="p-3 text-center">
                        <button onClick={setFollowingOpen} class="text-xl font-bold cursor-pointer block uppercase tracking-wide text-white">{followingCount}</button>
                        <span class="text-sm text-slate-400">Following</span>
                    </div>

                    <div class="p-3 text-center">
                        <span class="text-xl font-bold block uppercase tracking-wide text-white">564</span>
                        <span class="text-sm text-slate-400">Lists</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="text-center mt-2">
            <h3 class="text-2xl text-white font-bold leading-normal mb-1">{user.username}</h3>
            <div class="text-xs mt-0 mb-2 text-slate-200 font-bold uppercase">
                <i class="fas fa-map-marker-alt mr-2 text-slate-400 opacity-75"></i>{user.email}
            </div>
        </div>
        <div class="mt-6 py-6 border-t border-slate-200 text-center">
            <div class="flex flex-wrap justify-center">
                <div class="w-full px-4">
                    <p class="font-light leading-relaxed text-white mb-4">{user.bio ?? "An artist of considerable range, Mike is the name taken by Melbourne-raised, Brooklyn-based Nick Murphy writes, performs and records all of his own music, giving it a warm."}</p>
                    {token && (
                    <button onClick={toggleFollow} class="bg-gradient-to-r from-blue-500 to-cyan-400 
                     hover:from-cyan-400 hover:to-blue-500 
                     transition cursor-pointer 
                     px-6 py-1.5 rounded-full mt-5  gap-2 
                     shadow-lg shadow-blue-900/40 text-white">{followIcon} {followText}</button>
                     )}
                </div>
            </div>
        </div>
    </div>
    
</div>


)}

{followersOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
    
    <div className="bg-gray-900 rounded-xl w-[400px] max-h-[500px] overflow-y-auto p-6 shadow-xl border border-white/10">
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-xl font-bold">Followers</h2>
        <button
          onClick={() => setFollowersOpen(false)}
          className="text-gray-400 hover:text-white text-lg"
        >
          ✕
        </button>
      </div>

      {followers.length === 0 ? (
        <p className="text-gray-400">No followers yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {followers.map((follower) => (
            <div
              key={follower._id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition"
            >
              <img
                src={`${API_BASE_URL}/${follower.image}`}
                className="w-10 h-10 rounded-full"
              />
              <p className="text-white">{follower.username}</p>
            </div>
          ))}
        </div>
      )}

    </div>

  </div>
)}


{followingOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
    
    <div className="bg-gray-900 rounded-xl w-[400px] max-h-[500px] overflow-y-auto p-6 shadow-xl border border-white/10">
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-xl font-bold">Following</h2>
        <button
          onClick={() => setFollowingOpen(false)}
          className="text-gray-400 hover:text-white text-lg"
        >
          ✕
        </button>
      </div>

      {following.length === 0 ? (
        <p className="text-gray-400">No followers yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {following.map((f) => (
            <div
              key={f._id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition"
            >
              <img
                src={`${API_BASE_URL}/${following.image}`}
                className="w-10 h-10 rounded-full"
              />
              <p className="text-white">{f.username}</p>
            </div>
          ))}
        </div>
      )}

    </div>

  </div>
)}

<div className="m-20">
    <h2 className="font-bold text-white text-3xl  mb-5">{user.username}'s Ratings</h2>
    <div>
    {isLoading ? (
            <center>
          <img className="spinner" src="/Spinner.svg"/>
          </center>
      ) : diary.length == 0 ? (
         <p className="text-white text-md mt-5"> No movies in Diary.</p>
      ) : (
    ratings.map((r) => {
const movies = r.movieId;

    return (
      <div
        key={r._id}
        className="flex gap-6 p-5 rounded-xl
        bg-gradient-to-br from-gray-800 to-blue-900
        border border-white/10 mb-7"
      >

        
        <div className="flex-1">
          {movies.map(m => (
            <div key={m._id} className="mb-2">
              <h3 className="text-lg font-semibold text-white">
                {m.title}
              </h3>
            </div>
          ))}

         
          <div className="flex items-center gap-3 text-sm text-gray-300 mb-3">
            <div className="flex items-center gap-1 text-yellow-400">
              <img src="/star.svg" className="w-4 h-4" />
              <span>{r.rating}</span>
            </div>
            <span>•</span>
            <span>{dayjs(r.updatedAt).fromNow()}</span>
          </div>

          
          <p className="text-gray-200 leading-relaxed">
            {r.review}
          </p>
        </div>
          </div>
        );
      })
    )}
  </div>
</div>
  
  

    <div className="m-20">
      <h2 className="font-bold text-white text-3xl">{user.username}'s Watched Movies</h2>
      
            <div className="all-movies">
          {isLoading ? (
              <center>
            <img className="spinner" src="/Spinner.svg"/>
            </center>
        ) : diary.length == 0 ? (
          <p className="text-white text-md mt-5"> No movies in Diary.</p>
        ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-6 sm:grid-cols-2
      md:grid-cols-3 lg:gap-8 py-6 px-2 mt-10">
            {diary.map((movie) => (
              <div className="aspect-[2/3] rounded-lg overflow-hidden rounded bg-gray-300">
              <MovieCard movie={movie}/>
              </div>
            ))}
            </div>
    )}
        </div>
    </div>

    <div className="m-20">
      <h2 className="font-bold text-white text-3xl">{user.username}'s Liked Movies</h2>
      
            <div className="all-movies">
          {isLoading ? (
              <center>
            <img className="spinner" src="/Spinner.svg"/>
            </center>
        ) : likedMovies.length == 0 ? (
          <p className="text-white text-md mt-5"> No Liked Movies.</p>
        ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-6 sm:grid-cols-2
      md:grid-cols-3 lg:gap-8 py-6 px-4 m-10">
            {likedMovies.map((movie) => (
              <div className="aspect-[2/3] rounded-lg overflow-hidden rounded bg-gray-300">
              <MovieCard movie={movie}/>
              </div>
            ))}
            </div>
    )}
        </div>
    </div>

    <div className="m-20">
      <h2 className="font-bold text-white text-3xl">{user.username}'s WatchList</h2>
      
            <div className="all-movies">
          {isLoading ? (
              <center>
            <img className="spinner" src="/Spinner.svg"/>
            </center>
        ) : watchlist.length == 0 ? (
          <p className="text-white text-md mt-5"> WatchList is Empty.</p>
        ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-6 sm:grid-cols-2
      md:grid-cols-3 lg:gap-8 py-6 px-2 mt-10">
            {watchlist.map((movie) => (
              <div className="aspect-[2/3] rounded-lg overflow-hidden rounded bg-gray-300">
              <MovieCard movie={movie}/>
              </div>
            ))}
            </div>
    )}
        </div>
    </div>

    <div className="m-20">
      <h2 className="font-bold text-white text-3xl">{user.username}'s Movie Lists</h2>
      
            <div className="all-movies">
          {isLoading ? (
              <center>
            <img className="spinner" src="/Spinner.svg"/>
            </center>
        ) : movieLists.length == 0 ? (
          <p className="text-white text-md mt-5"> Movie Lists is Empty.</p>
        ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-6 sm:grid-cols-2
      md:grid-cols-3 lg:gap-8 py-6 px-2 mt-10">
            {movieLists.map((movie) => (
              <div className="aspect-[2/3] rounded-lg overflow-hidden rounded bg-gray-300">
              <MovieCard movie={movie}/>
              </div>
            ))}
            </div>
    )}
        </div>
    </div>


  </div>

    
  
    
  )
}

export default Profile