import React, { useRef, useState, useEffect } from "react";
import { Outlet, NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../auth/AuthContext';
import axios from 'axios'

const apiUrl =  'https://api.themoviedb.org/3';
const apiKey = import.meta.env.VITE_TMDB_API_KEY;

const apiOptions = {
  method: 'GET',
  headers : {
    accept: 'application/json',
    Authorization: `Bearer ${apiKey}`
  }
}

const Nav = () => {
  const API_URL =  import.meta.env.VITE_API_URL;
    const [errorMessage, setErrorMessage] = useState("");
    const [genres, setGenres] = useState([]);
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const { logout } = useAuth();
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('jwtToken');
    const navigate = useNavigate();
    const location = useLocation();
    const dropdownRef = useRef(null);
    const dropdownRef2 = useRef(null);
    const dropdownRef3 = useRef(null);
    const dropdownRef4 = useRef(null);
    const userId = localStorage.getItem('user_ID');

    
    useEffect(() => {
        if (!open && !open2 && !open3 && !notifOpen) return;

        const handleClickOutside = (e) => {
            if (
                !dropdownRef.current?.contains(e.target) &&
                !dropdownRef2.current?.contains(e.target) &&
                !dropdownRef3.current?.contains(e.target) &&
                !dropdownRef4.current?.contains(e.target)
            ) {
                setOpen(false);
                setOpen2(false);
                setOpen3(false);
                setNotifOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open, open2, open3, notifOpen]);

  
    const displayGenres = async () => {
        try {
            const endpoint = `${apiUrl}/genre/movie/list?language=en`;
            const response = await fetch(endpoint, apiOptions);
            if (!response.ok) throw new Error("Failed to fetch genres");
            const data = await response.json();
            setGenres(data.genres || []);
        } catch (error) {
            console.error(error);
            setErrorMessage('Failed to fetch genres');
        }
    }

    useEffect(() => { displayGenres(); }, []);

    useEffect(() => {
    if (!token) return;

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${API_URL}/notifications/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data || []);
        console.log(res);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
  }, [token]);

  console.log(notifications);
    
    useEffect(() => {
        if (!token) return;

        const ws = new WebSocket("ws://localhost:3000"); 

        ws.onopen = () => console.log("WebSocket connected!");

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("New notification:", data);
            setNotifications(prev => [data, ...prev]);
            setNotifOpen(true);
        };

        ws.onclose = () => console.log("WebSocket closed");

        return () => ws.close();
    }, []);

    const goToLogin = () => {
        navigate("/login", { state: { from: window.location.pathname + window.location.search } })
    }

    const handleLogoutClick = () => {
        logout();
    };

    return (
        <nav className="bg-neutral-primary w-full z-99 top-0 start-0 border-default text-white p-3">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <p className="self-center text-xl text-heading font-semibold whitespace-nowrap">Movie App</p>
                </a>

                
                <button onClick={() => setOpen(!open)} type="button" className="cursor-pointer inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading">
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>

                <div ref={dropdownRef} className={`w-full md:block md:w-auto ${open ? "block" : "hidden"}`}>
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-neutral-primary">


  <li><Link to="/home" className="block py-2 px-3 text-white rounded">Browse</Link></li>
  <li><Link to="/members" className="block py-2 px-3 text-white rounded">Members</Link></li>

 
  <li className="relative">
    <button onClick={() => setOpen2(!open2)} className="flex cursor-pointer items-center justify-between w-full py-2 px-3 rounded font-medium text-heading">
      Categories
      <svg className="w-4 h-4 ms-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 9-7 7-7-7"/>
      </svg>
    </button>
    {open2 && (
      <div className="absolute z-10 bg-white text-black border border-default-medium rounded-base shadow-lg w-44">
        <ul className="p-2 text-sm text-body font-medium">
          {genres.map((genre) => (
            <li key={genre.id}>
              <Link to={`/categories/${genre.id}/${genre.name}`} className="block w-full p-2 hover:bg-gray-200">{genre.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    )}
  </li>


  <li><Link to="/movieList" className="block py-2 px-3 text-white rounded">Lists</Link></li>

  
  {!token && (
    <>
      <li>
        <button onClick={goToLogin} className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand">
          Sign In
        </button>
      </li>
      <li>
        <Link to="/sign-up" className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand">
          Create Account
        </Link>
      </li>
    </>
  )}

 
  {token && (
    <>
    
      <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 text-white cursor-pointer"
              >
                🔔
                {notifications.length > 0 && (
                  <span className="absolute -top-0 -right-0 bg-red-500 text-xs rounded-full w-4 h-4 flex items-center justify-center text-white">
                    {notifications.length}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-gray-800 text-white rounded-lg shadow-lg overflow-y-auto max-h-96 z-50">
                  {notifications.length === 0 && (
                    <p className="p-4 text-center text-sm">No notifications</p>
                  )}
                  {notifications.map((notif) => (
                    <div
                      key={notif._id || notif.id}
                      className="border-b border-gray-700 p-3 hover:bg-gray-700 cursor-pointer"
                    >
                      <p className="text-sm">{notif.message}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(notif.createdAt || notif.date).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

     
      <li className="relative">
        <button onClick={() => setOpen3(!open3)} className="flex cursor-pointer items-center justify-between w-full py-2 px-3 rounded font-medium text-heading">
          User
        </button>
        {open3 && (
          <div className="absolute z-10 bg-white text-black border border-default-medium rounded-base shadow-lg w-35 h-auto">
            <ul className="p-2 text-sm text-body font-medium">
              <li className="p-2 hover:bg-gray-100"><Link to="/list">WatchList</Link></li>
              <li className="p-2 hover:bg-gray-100"><Link to="/liked">Liked</Link></li>
              <li className="p-2 hover:bg-gray-100"><Link to="/diary">Diary</Link></li>
              <li className="p-2 hover:bg-gray-100"><Link to="/rated">Ratings</Link></li>
              <li className="p-2 hover:bg-gray-100"><Link to="/account">Account</Link></li>
              <li className="p-2 hover:bg-gray-100"><button onClick={handleLogoutClick}>Logout</button></li>
            </ul>
          </div>
        )}
      </li>
    </>
  )}
</ul>
                </div>
            </div>
        </nav>
    );
};

export default Nav;