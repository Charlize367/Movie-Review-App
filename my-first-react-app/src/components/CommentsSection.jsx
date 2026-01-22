import React from 'react'

import { Form, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react'
import Nav from './Nav.jsx';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"



const CommentsSection = ({ movieListId }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('jwtToken');
  const param = useParams();
  const userId = localStorage.getItem('user_ID');
  const [isActive, setIsActive] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [updateCommentID, setUpdateCommentID] = useState(0);
  const [updateComment, setUpdateComment] = useState("");
  const [updateData, setUpdateData] = useState([]);
 
   dayjs.extend(relativeTime);
   


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

console.log(movieListId);
const getComment = async() => {
         try{
       

console.log('Sending request for movieListId:', movieListId);
        const response = await axios.get(`${API_URL}/movieList/comments/${movieListId}`, {
          headers : {
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        console.log(response);
        


      
        setComments(response.data.comments);
      } catch (error) {
        console.log(error);
      }

    }


  useEffect(() => {
    if (!movieListId) return;
    getComment();
  }, [movieListId]);

  
console.log(movieListId);
  console.log(comments);

  const addComment = async(e) => {

     e.preventDefault();

      try{
       

        const finalData = {
          comment: comment
        };


        const response = await axios.post(`${API_URL}/movieList/${userId}/${movieListId}/comment`, finalData, {
          headers : {
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        console.log(response);

      
        setComment("");

        getComment();
      } catch (error) {
        console.log(error);
      }

  }

  const editComment = async(e) => {
     e.preventDefault();
    
    
    try {
        const response = await axios.put(`${API_URL}/movieList/${updateCommentID}/${movieListId}/comment`, updateData, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
              });

              console.log(response);

              
              setIsActive(!isActive);
              e.target.reset();

              getComment();

              } catch (error) {
              console.log(error);
              
            }
  }

  const deleteComment = async(id) => {

    
    
    try {
        const response = await axios.delete(`${API_URL}/movieList/${id}/${movieListId}/comment`, {
                  headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `Bearer ${token}`
                  }
              });

              console.log(response);

              
            

              getComment();

              } catch (error) {
              console.log(error);
              
            }
  }


   
  return (
    <div className="w-full bg-gray-900 h-screen">
   
     

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
      <button className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-white">
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
    <form class="mb-6">
        <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <label for="comment" class="sr-only">Your comment</label>
            <textarea id="comment" value={comment} onChange={handleCommentChange} rows="6"
                class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                placeholder="Write a comment..." required></textarea>
        </div>
        <button onClick={addComment} type="submit"
            class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
            Post comment
        </button>
    </form>
    {comments.map(c => (
    <article class="p-6 text-base bg-white rounded-lg dark:bg-gray-900">
        <footer class="flex justify-between items-center mb-2">
            <div class="flex items-center">
                <p class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold"><img
                        class="mr-2 w-6 h-6 rounded-full"
                        src={`http://localhost:3000/${c.user.image}`}
                        alt="Michael Gough"/>{c.user.username}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400"><time pubdate datetime="2022-02-08"
                        title="February 8th, 2022">{dayjs(c.updatedAt).fromNow()}</time></p>
            </div>
            <div class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 dark:text-gray-400 bg-white rounded-lg focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:focus:ring-gray-600">

              {c.user._id === userId && (
             <button className="hover:bg-gray-700" onClick={() => {openUpdateCommentForm(c._id, movieListId)}}><img className="w-4 h-4" src="/edit-icon.svg"/> </button>
              )}

              {c.user._id === userId && (
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

      
      


export default CommentsSection