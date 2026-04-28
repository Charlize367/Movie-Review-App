import React from 'react'
import Search from './components/Search'
import Nav from './components/Nav'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Members = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const browseUsers = users.slice(0, 8);
    const [errorMessage, setErrorMessage] = useState("");
    const token = localStorage.getItem('jwtToken');


    const getUsers = async () => {
       try {
             const response = await axios.get(`${API_URL}/users`, {
                  headers: {
                       'Content-Type': 'application/json',
                  }
              });

              console.log(response);
              setUsers(response.data.data);
              setIsLoading(false);
              
              
            } catch (error) {
              console.log(error);
              setErrorMessage(error);
              
            }
          }
  
      useEffect(() => {
      getUsers();
      
    }, []);

    console.log(users);
  return (
    <div>
        <Nav />
      <div className="flex justify-center relative mt-10 lg:mt-10 px-4">
        <h1 className="text-center max-w-2xl font-bold text-white leading-tight text-xl sm:text-4xl md:text-2xl lg:text-2xl xl:text-5xl
  ">Search members</h1>
      </div>
         <div className="relative w-full flex justify-center items-center m-5 mx-auto">
      <Search />
      </div>
      {isLoading ? (
            <center>
          <img className="spinner" src="/Spinner.svg"/>
          </center>
        ) : errorMessage ? (
        <p>{errorMessage}</p>
        ) : users.length == 0 ? (

        <p className="text-white text-md m-15"> No liked movies.</p>
      ) : (
     <div class="grid grid-cols-1 cursor-pointer gap-6 m-15 lg:grid-cols-4 md:grid-cols-3 py-6 px-4 place-items-center">
    
  {browseUsers.map(u => (
    <Link to = {`/profile/${u._id}`}>
    <div class="flex flex-col items-center justify-center text-center 
                bg-white/10 backdrop-blur-md 
                rounded-2xl p-6 
                border border-white/20 
                hover:-translate-y-1 
                hover:shadow-2xl hover:shadow-blue-900/40 
                transition duration-300 w-64">

     
      <div class="w-28 h-28 rounded-full overflow-hidden flex items-center justify-center">
        <img 
          class="w-full h-full object-cover object-top"
          src={`${API_BASE_URL}/${u.image}`} 
          alt="userImage2" 
        />
      </div>

     
      <p class="font-medium mt-4 tracking-wide text-white">
        {u.username}
      </p>

      
      {token && (
                    <button class="bg-gradient-to-r from-blue-500 to-cyan-400 
                     hover:from-cyan-400 hover:to-blue-500 
                     transition cursor-pointer 
                     px-6 py-1.5 rounded-full mt-5  gap-2 
                     shadow-lg shadow-blue-900/40 text-white">+ Follow</button>
                     )}

    </div>
    </Link>
  ))}
</div>

      )}
    </div>
  )
}

export default Members