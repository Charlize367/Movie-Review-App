import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Link } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

    const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(username);
            try {
                const postData = {
                    "username" : username,
                    "password" : password,
                    "role" : "USER"
                }
                const response = await axios.post('http://localhost:3000/api/v1/auth/sign-in', postData, {
                    headers: {
                        
                        'Content-Type': 'application/json'
                    }
                });
                 login({username: response.data.data.user.username, role: response.data.data.user.role, id: response.data.data.user._id}, response.data.data.token)
                navigate('/home');
                return true;

            } catch (error) {
                 window.alert("Login failed");
                console.error('Login failed:', error);
                return false;
            }

        }


    return(
       
        <section className="login-body">
            
        <div className="form-container">
            <h2>Sign In.</h2>
            <form onSubmit={handleSubmit}>
            <input className="fields" type="text" placeholder="Username" value={username} onChange={handleUsernameChange}  />
            <input className="fields" type="password" placeholder="Password" value={password} onChange={handlePasswordChange}/>
            <input className="loginBtn" type="submit" value="Login" />
            </form>
            <Link className="goToSignUp" to ="/sign-up">Don't have an account? Sign up here.</Link>
            
        </div>
</section>

    )

}




export default Login