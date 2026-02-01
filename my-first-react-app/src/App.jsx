import React from 'react'
import { BrowserRouter as Router, Routes, Route, BrowserRouter} from 'react-router-dom'
import Categories from './Categories'
import List from './List'
import Liked from './Liked'
import Rated from './Rated'
import Home from './Home.jsx'
import AllRatings from './AllRatings.jsx'
import Diary from './Diary.jsx'
import Login from './auth/Login.jsx'
import SignUp from './auth/SignUp.jsx'
import MovieDetails from './MovieDetails.jsx'
import { AuthProvider } from './auth/AuthContext.jsx'
import Comments from './Comments.jsx'
import Account from './Account.jsx'
import MovieList from './MovieList.jsx'
import MovieListPage from './MovieListPage.jsx'



const App = ()  => {
  return (
   
      <AuthProvider>
      <BrowserRouter>
    
            <Routes>
                <Route exact path="/login" element={<Login/>} />
                <Route exact path="/sign-up" element={<SignUp/>} />

                <Route exact path="/categories/:id/:name" element={<Categories />} />
                <Route exact path="/liked" element={<Liked />} />
                <Route exact path="/all_ratings/:id" element={<AllRatings />} />
                <Route exact path="/list" element={<List />}/>
                <Route exact path="/diary" element={<Diary />} />
                <Route exact path="/rated" element={<Rated />} />
                <Route exact path="/home" element={<Home />}/>
                <Route exact path="/movieList" element={<MovieList />} />
                <Route exact path="/movieListPage/:id" element={<MovieListPage />} />
                <Route exact path="/movie_details/:id" element={<MovieDetails />} />
                <Route exact path="/comments/:id/:ratingId" element={<Comments />} />
                <Route exact path="/account" element={<Account />} />

            </Routes>
            </BrowserRouter>
        </AuthProvider>
   
)}

export default App;