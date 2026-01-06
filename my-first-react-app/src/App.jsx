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
import ProtectedRoute from './auth/ProtectedRoute.jsx'
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

                <Route exact path="/categories/:id/:name" element={<ProtectedRoute allowedRoles={["USER"]}><Categories /></ProtectedRoute>} />
                <Route exact path="/liked" element={<ProtectedRoute allowedRoles={["USER"]}><Liked /></ProtectedRoute>} />
                <Route exact path="/all_ratings/:id" element={<ProtectedRoute allowedRoles={["USER"]}><AllRatings /></ProtectedRoute>} />
                <Route exact path="/list" element={<ProtectedRoute allowedRoles={["USER"]}><List /></ProtectedRoute>} />
                <Route exact path="/diary" element={<ProtectedRoute allowedRoles={["USER"]}><Diary /></ProtectedRoute>} />
                <Route exact path="/rated" element={<ProtectedRoute allowedRoles={["USER"]}><Rated /></ProtectedRoute>} />
                <Route exact path="/home" element={<ProtectedRoute allowedRoles={["USER"]}><Home /></ProtectedRoute>} />
                <Route exact path="/movieList" element={<ProtectedRoute allowedRoles={["USER"]}><MovieList /></ProtectedRoute>} />
                <Route exact path="/movieListPage/:id" element={<ProtectedRoute allowedRoles={["USER"]}><MovieListPage /></ProtectedRoute>} />
                <Route exact path="/movie_details/:id" element={<ProtectedRoute allowedRoles={["USER"]}><MovieDetails /></ProtectedRoute>} />
                <Route exact path="/comments/:id/:ratingId" element={<ProtectedRoute allowedRoles={["USER"]}><Comments /></ProtectedRoute>} />
                <Route exact path="/account" element={<ProtectedRoute allowedRoles={["USER"]}><Account /></ProtectedRoute>} />

            </Routes>
            </BrowserRouter>
        </AuthProvider>
   
)}

export default App;