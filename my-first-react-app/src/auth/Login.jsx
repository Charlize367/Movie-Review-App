import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate, useLocation} from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Link } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/home";
  const { login } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;
  console.log(from);

    const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleGoToSignup = () => {
  navigate("/signup", {
    state: {
      from: location.state?.from
    }
  });
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
                const response = await axios.post(`${API_URL}/auth/sign-in`, postData, {
                    headers: {
                        
                        'Content-Type': 'application/json'
                    }
                });
                 login({username: response.data.data.user.username, role: response.data.data.user.role, id: response.data.data.user._id}, response.data.data.token)
                navigate(from, {
                replace: true,
                state: {
                    popup: "✅ Logged in successfully",
                }
                });
                return true;

            } catch (error) {
                 window.alert("Login failed");
                console.error('Login failed:', error);
                return false;
            }

        }


    return(
       
        <section className="login-body">
            
     <div class="w-full mx-auto max-w-md space-y-4 m-30 bg-gray-900 p-6 border border-default rounded-lg shadow-xs">
    <form action="#" onSubmit={handleSubmit}>
        <h5 class="text-xl font-semibold text-white text-heading mb-6">Sign in to your account.</h5>
        <div class="mb-4">
            <label for="username" class="block text-white mb-2.5 text-sm font-medium text-heading">Your username</label>
            <input type="username" id="username" value={username} onChange={handleUsernameChange} class="bg-transparent text-white border border-[0.5px] rounded-lg border-gray-100 border-default-small text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="Username" required />
        </div>
        <div>
            <label for="password" class="block text-white mb-2.5 text-sm font-medium text-heading">Your password</label>
            <input type="password" id="password" value={password} onChange={handlePasswordChange} class="bg-transparent text-white border border-[0.5px] rounded-lg border-gray-100 border-default-small text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="Password" required />
        </div>
        
        <button type="submit" class="block w-full  mt-10 mb-5 rounded-lg bg-gradient-to-r from-blue-700 to-cyan-600 px-12 py-3 text-sm font-medium text-white transition-colors hover:bg-transparent hover:text-indigo-600 dark:hover:bg-indigo-700 dark:hover:text-white">Login</button>
        <Link className="text-white" onClick={handleGoToSignup}>Don't have an account? Sign up here.</Link>
    </form>
</div>

</section>

    )

}




export default Login