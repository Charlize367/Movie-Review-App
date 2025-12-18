import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Link } from "react-router-dom";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const navigate = useNavigate();
  const { signup } = useAuth();

  
    const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(username);
         if(password === confirmPassword) {
            try {

               const response_img = await fetch("/profile.png");
                const blob = await response_img.blob();
                const image = new File([blob], "profile.png", {type: "image/png"});

                const postData = {
                    "username" : username,
                    "password" : password,
                    "email" : email,
                    "role" : "USER",
                    "image" : image
                }

               

                const response = await axios.post('http://localhost:3000/api/v1/auth/sign-up', postData, {
                    headers: {
                        
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log(response);
                signup({username: response.data.data.user.username, email: response.data.data.user.email, role: response.data.data.user.role, id: response.data.data.user._id}, response.data.data.token)
                navigate('/home');
                return true;

            } catch (error) {
                 window.alert(error);
                console.error('Login failed:', error);
                return false;
                
            }

        } else {
            window.alert("Passwords do not match.");
        }
    }

        


    return(
        <section className="login-body">
            

        <div class="w-full mx-auto max-w-md space-y-4 m-30 bg-gray-900 p-6 border border-default rounded-lg shadow-xs">
            <form action="#" onSubmit={handleSubmit}>
                <h5 class="text-xl font-semibold text-white text-heading mb-6">Sign in to your account.</h5>
                <div class="mb-4">
                    <label for="username" class="block text-white mb-2.5 text-sm font-medium text-heading">Your username</label>
                    <input type="text" id="username" value={username} onChange={handleUsernameChange} class="bg-transparent text-white border border-[0.5px] rounded-lg border-gray-100 border-default-small text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="Username" required />
                </div>
                <div class="mb-4">
                    <label for="email" class="block text-white mb-2.5 text-sm font-medium text-heading">Your email</label>
                    <input type="text" id="email" value={email} onChange={handleEmailChange} class="bg-transparent text-white border border-[0.5px] rounded-lg border-gray-100 border-default-small text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="Username" required />
                </div>
                <div>
                    <label for="password" class="block text-white mb-2.5 text-sm font-medium text-heading">Your password</label>
                    <input type="password" id="password" value={password} onChange={handlePasswordChange} class="bg-transparent text-white border border-[0.5px] rounded-lg border-gray-100 border-default-small text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="Password" required />
                </div>
                <div>
                    <label for="confirmPassword" class="block text-white mb-2.5 text-sm font-medium text-heading">Confirm password</label>
                    <input type="password" id="confirmPassword" value={confirmPassword} onChange={handleConfirmPasswordChange} class="bg-transparent text-white border border-[0.5px] rounded-lg border-gray-100 border-default-small text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="Password" required />
                </div>
                
                <button type="submit" class="block w-full  mt-10 mb-5 rounded-lg border border-blue-600 bg-blue-900 px-12 py-3 text-sm font-medium text-white transition-colors hover:bg-transparent hover:text-indigo-600 dark:hover:bg-indigo-700 dark:hover:text-white">Sign Up</button>
                
            </form>
        </div>
</section>
    )
}

export default SignUp