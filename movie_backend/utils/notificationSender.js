import Notification from "../models/notificationModel.js";

export const notificationSender = async (wss, userId, notification) => {
    console.log("Reacing notif sender");

    console.log("Connected clients:", wss.clients.size);

    wss.clients.forEach(client => {
        console.log("Checking client:", client.userId);
        console.log("Check sent userId", userId);
        console.log("Checking client ready state: ", client.readyState)
        if(client.userId === String(userId) && client.readyState === 1) {
             console.log("Sending notification:", notification);
            client.send(JSON.stringify(notification));
           
        }
    

   
     
        
    })
}