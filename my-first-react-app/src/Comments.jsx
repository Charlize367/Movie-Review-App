import React from 'react'

import { Form, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react'
import Nav from './components/Nav.jsx'
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"



const Comments = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem('jwtToken');
  const param = useParams();
  const userId = localStorage.getItem('user_ID');
  const [rate, setRate] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [updateCommentID, setUpdateCommentID] = useState(0);
  const [updateData, setUpdateData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [loading, setLoading] = useState(true);
 
 
   dayjs.extend(relativeTime);

   useEffect(() => {
       if (location.state?.popup) {
         setPopupMessage(location.state.popup);
         setShowPopup(true);
     
         setTimeout(() => setShowPopup(false), 3000);
       }
     }, []);
   

  const openUpdateCommentForm = (commentId) => {

    const selectedComment = comments.find(c => c._id === commentId);
    if (selectedComment) {
      setUpdateData({
      comment: selectedComment.comment,
      });
    }
    setIsActive(!isActive);
    setUpdateCommentID(commentId);
    
  }

  const handleUpdateCommentChange = async(e) => {
    setUpdateData({ ...updateData, comment: e.target.value });
  }



  const handleCommentChange = (e) => {
  setComment(e.target.value);
};

    const getComment = async() => {
         try{
       


        const response = await axios.get(`${API_URL}/ratings/comments/${param.ratingId}`, {
          headers : {
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        

      
        setComments(response.data.comments);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }

    }

    useEffect(() => {
      getComment();
  }, []);


  

  console.log(comments);

  const addComment = async(e) => {

     e.preventDefault();

      try{
       

        const finalData = {
          comment: comment
        };


        const response = await axios.post(`${API_URL}/ratings/${userId}/${param.ratingId}/comment`, finalData, {
          headers : {
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        console.log(response);

      
        setComment("");

        getComment();
       setShowPopup(true);
      setPopupMessage("Comment added successfully.");

      setTimeout(() => setShowPopup(false), 3000);
      } catch (error) {
        console.log(error);
      }

  }

  const editComment = async(e) => {
     e.preventDefault();
    
    
    try {
        const response = await axios.put(`${API_URL}/ratings/${updateCommentID}/${param.ratingId}/comment`, updateData, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
              });

              console.log(response);

              
              setIsActive(!isActive);
              e.target.reset();

              getComment();
              setShowPopup(true);
      setPopupMessage("Comment edited successfully.");

      setTimeout(() => setShowPopup(false), 3000);

              } catch (error) {
              console.log(error);
              
            }
  }

  const deleteComment = async(id) => {

    
    try {
        const response = await axios.delete(`${API_URL}/ratings/${id}/${param.ratingId}/comment`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
              });

              console.log(response);

              
            

              getComment();
              setShowPopup(true);
      setPopupMessage("Comment deleted successfully.");

      setTimeout(() => setShowPopup(false), 3000);

              } catch (error) {
              console.log(error);
              
            }
  }

  const goToLogin = () => {
    navigate("/login", {
      state: {
        from: location.pathname + location.search
      }
    })
  }
   
  return (
    <div className="w-full bg-gray-900 h-screen">
      <Nav />
     

    <div className="w-full flex justify-center">

  {isActive && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  <div class="bg-gray-900 rounded-2xl p-4 shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
  <form onSubmit={editComment}>
   
  <h2 className="text-lg font-bold text-white mb-3">Edit Comment</h2>
          <textarea rows="6" value={updateData.comment} onChange={handleUpdateCommentChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3
                 text-gray-100 placeholder-gray-400
                 focus:ring-2 focus:ring-indigo-500
                 shadow-inner mb-4" placeholder="Add review..." name="review"  />
          <div className="flex justify-end gap-3">
      <button className="text-gray-400 hover:text-white" onClick={openUpdateCommentForm}>Cancel</button>
      <button className="bg-gradient-to-r from-blue-700 to-cyan-600 px-4 py-2 rounded-lg text-white">
        Save
      </button>
    </div>
    </form>
  </div>
  </div>
  )}

  <section class="mx-auto bg-gray-900 w-full py-8 lg:py-16 antialiased">
  <div class="max-w-2xl mx-auto px-4">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Discussion</h2>
    </div>
    {token && (
    <form class="mb-6">
        <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <label for="comment" class="sr-only">Your comment</label>
            <textarea id="comment" value={comment} onChange={handleCommentChange} rows="6"
                class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                placeholder="Write a comment..." required></textarea>
        </div>
        <button onClick={addComment} type="submit"
            class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-gradient-to-r from-blue-700 to-cyan-600 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
            Post comment
        </button>
    </form>
    )}

    {loading && (
      <div className="flex justify-center my-6">
        <img src="/Spinner.svg" alt="Loading..." className="w-12 h-12" />
      </div>
    )}


{token && !loading  && comments.length === 0 && (
  <span className="text-white flex m-10 justify-center">
    No comments found. 
  </span>
)}
    {!loading && !token && comments.length === 0 && (
  <span className="text-white">
    No comments found. Please{" "}
    <a
      onClick={goToLogin}
      className="text-cyan-400 cursor-pointer hover:underline"
    >
      sign in
    </a>{" "}
    to comment.
  </span>
)}



{showPopup && (
            <div
        className={`
          fixed top-6 right-6 z-50 max-w-xs z-99 w-full p-4 rounded-xl shadow-lg
          bg-gray-700 text-white text-sm font-medium transition-transform duration-300
          ${showPopup ? "translate-x-0 opacity-100" : "translate-x-32 opacity-0"}
        `}
      >
        {popupMessage}
      </div>
              )}

    
    {comments.map(c => (
    <article class="p-6 text-base bg-white rounded-lg dark:bg-gray-900">
        <footer class="flex justify-between items-center mb-2">
            <div class="flex items-center">
                <p class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold"><img
                        class="mr-2 w-6 h-6 rounded-full"
                        src={`${API_BASE_URL}/${c.userId.image}`}
                        alt="Michael Gough"/>{c.userId.username}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400"><time pubdate datetime="2022-02-08"
                        title="February 8th, 2022">{dayjs(c.updatedAt).fromNow()}</time></p>
            </div>
            <div class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 dark:text-gray-400 bg-white rounded-lg focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:focus:ring-gray-600">
              {c.userId._id === userId && (
             <button className="hover:bg-gray-700" onClick={() => {openUpdateCommentForm(c._id, param.ratingId)}}><img className="w-4 h-4" src="/edit-icon.svg"/> </button>
            )}
            
            {c.userId._id === userId && (
            <button className="hover:bg-gray-700 ml-1" onClick={() => {deleteComment(c._id)}}><img className="w-4 h-4" src="/delete-icon.svg"/> </button>
            )}
            </div>
             
            
        </footer>
        <p class="text-gray-500 dark:text-gray-400">{c.comment}</p>
        
    </article>
    ))}
  </div>
</section>
    </div>
    </div>
    
   
          
       




  )
      
}

      
      


export default Comments