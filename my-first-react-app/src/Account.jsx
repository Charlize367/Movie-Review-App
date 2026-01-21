
import React from 'react'
import { useState, useEffect } from 'react'
import Nav from './components/Nav.jsx'
import axios from 'axios';



const Account = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem('jwtToken');
  
  const userId = localStorage.getItem('user_ID');
  const [isActive, setIsActive] = useState(false);
  const [isActive2, setIsActive2] = useState(false);
  const [rating, setRating] = useState(0);
  const [inputData, setInputData] = useState([]);
  const [updateID, setUpdateID] = useState(0);
  const [user, setUser] = useState([]);
  const [updateData, setUpdateData] = useState([]);
  const [imageData, setImageData] = useState("");

  const openForm = () => {
   
    
    setUpdateData({
      username: user.username,
      email: user.email,
      password: user.password
      });

    setIsActive(!isActive);
  }

  const openImageForm = () => {
   
    
    setImageData({
      image: user.image
      });

    setIsActive2(!isActive2);
  }


  const handleChange = (e) => {

    const { name, value } = e.target;
    setUpdateData(prev => ({
    ...prev,
    [name]: value
  }));

  }

  const handleChange2 = (e) => {

    const file = e.target.files[0]; 

  setImageData(prev => ({
    ...prev,
    image: file
  }));

  }

  const getUser = async () => {
       try {
             const response = await axios.get(`${API_URL}/users/${userId}`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
              });

              console.log(response);
              setUser(response.data.data);

              
            } catch (error) {
              console.log(error);
              
            }
          }
  useEffect(() => {
      getUser();
  }, []);
    

  const updateAccountDetails = async(e) => {
       e.preventDefault();
      
      
      try {
          const response = await axios.put(`${API_URL}/users/${userId}`, updateData, {
                    headers: {
                         'Content-Type': 'application/json',
                         'Authorization': `Bearer ${token}`
                    }
                });
  
                console.log(response);
  
                
                setIsActive(!isActive);
                e.target.reset();
  
                getUser();
  
                } catch (error) {
                console.log(error);
                
              }
    }

    const updateProfileImage = async(e) => {
       e.preventDefault();
      
      
      try {
        const formData = new FormData();
    formData.append("image", imageData.image);
          const response = await axios.put(`${API_URL}/users/${userId}/image`, formData, {
                    headers: {
                         
                         'Authorization': `Bearer ${token}`
                    }
                });
  
                console.log(response);
  
                
                setIsActive2(!isActive2);
                e.target.reset();
  
                getUser();
  
                } catch (error) {
                console.log(error);
                
              }
    }
  

  console.log(user);
   
  return (
    <div className="w-full">
      <Nav/>

         <h2 className="font-bold text-white text-4xl flex justify-center mb-5">My Account</h2>
       <div>

    {isActive && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  <div class="bg-gray-900 rounded-2xl p-4 shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
  <form onSubmit={updateAccountDetails}>
   
  <h2 className="text-lg font-bold text-white mb-3">Edit Comment</h2>
  <label className="text-white">Username:</label>
          <input type="text" name="username" value={updateData.username} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3
                 text-gray-100 placeholder-gray-400
                 focus:ring-2 focus:ring-indigo-500
                 shadow-inner mb-4" />
    <label className="text-white">Email:</label>
        <input type="text" name="email" value={updateData.email} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3
                 text-gray-100 placeholder-gray-400
                 focus:ring-2 focus:ring-indigo-500
                 shadow-inner mb-4" />
    <label className="text-white">Password:</label>
        <input type="password" name="password" value={updateData.password} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3
                 text-gray-100 placeholder-gray-400
                 focus:ring-2 focus:ring-indigo-500
                 shadow-inner mb-4" />
          <div className="flex justify-end gap-3">
      <button className="text-gray-400 hover:text-white" onClick={openForm}>Cancel</button>
      <button className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-white">
        Save
      </button>
    </div>
    </form>
  </div>
  </div>
  )}

  {isActive2 && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  <div class="bg-gray-900 rounded-2xl p-4 shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
  <form onSubmit={updateProfileImage}>
   
  <h2 className="text-lg font-bold text-white mb-3">Edit Profile Picture</h2>
  <label className="text-white">Profile Picture:</label>
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

    <div class="bg-gray-900 m-10 overflow-hidden shadow rounded-lg border">
    <div className="flex">
    <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-white">
            User Profile
        </h3>
        <p class="mt-1 max-w-2xl text-sm text-white">
            This is some information about the user.
        </p>
    </div>
    <button onClick={openForm} type="button" class="bg-gradient-to-r from-blue-700 to-cyan-600 hover:bg-indigo-500 m-5 p-3 rounded-lg text-white">Edit User Details</button>
    </div>
    <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl class="sm:divide-y sm:divide-gray-200">
            <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-white">
                    Full name
                </dt>
                <dd class="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                    {user.username}
                </dd>
            </div>
            <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-white">
                    Profile Picture
                </dt>
                <dd class="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                   <img class="w-24 h-24 mb-6 rounded-full" src={`${API_BASE_URL}/${user.image}`} alt="Bonnie image"/>
                   <button onClick={openImageForm} type="button" class="bg-gradient-to-r from-blue-700 to-cyan-600 m-5 p-3 rounded-lg text-white">Edit Image</button>
                </dd>
                
            </div>
            <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-white">
                    Email address
                </dt>
                <dd class="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                    {user.email}
                </dd>
            </div>
            <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-white">
                    Password
                </dt>
                <dd class="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                    {user.password}
                </dd>
            </div>
            
        </dl>
    </div>
</div>
              
            
            </div>
    </div>
  
  )
}

export default Account