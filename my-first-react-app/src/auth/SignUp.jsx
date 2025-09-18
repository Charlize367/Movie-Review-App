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
            
        <div className="form-container">
            <h2>Sign Up.</h2>
            <form onSubmit={handleSubmit}>
            <input className="fields" type="text" placeholder="Username" value={username} onChange={handleUsernameChange}  />
            <input className="fields" type="text" placeholder="Email" value={email} onChange={handleEmailChange}  />
            <input className="fields" type="password" placeholder="Password" value={password} onChange={handlePasswordChange}/>
            <input className="fields" type="password" placeholder="Confirm Password" value={confirmPassword} onChange={handleConfirmPasswordChange}/>
            <input className="loginBtn" type="submit" value="Sign Up" />
            </form>
            
        </div>
</section>
    )
}

export default SignUp