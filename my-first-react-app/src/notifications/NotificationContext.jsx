import React, { createContext, useState, useEffect, useContext } from 'react'


const NotificationContext = createContext();
export const NotificationProvider = ({ children }) => {

    const [notifications, setNotifications] = useState([]);
    const [ws, setWs] = useState(null);
    const token = localStorage.getItem('jwtToken');
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:3000");
        setWs(socket);

        

        socket.onopen = () => console.log("Connected to WebSocket server.");
        socket.onclose = () => console.log("Disconnected from WebSocket server.");

        socket.onmessage = (event) => {
            try {
                const notification = JSON.parse(event.data);
                console.log(notification);
                setNotifications((prev) => [notification, ...prev]);
            } catch (error) {
                console.error(error);
            }
        };

        return () => socket.close();
    }, []);

    const getNotifications = async () => {
       const response = await axios.get(`${API_URL}/notifications`, {
            
            withCredentials: true,
            });
        const data = await response.json();
        setNotifications(data);
        console.log(response);
    }

    console.log(notifications);
 return (
    <NotificationContext.Provider value={{ notifications, getNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);