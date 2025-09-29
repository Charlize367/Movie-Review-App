import React from 'react'

import { Form, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react'
import Nav from './components/Nav.jsx'
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"



const Comments = () => {
  const API_URL = 'http://localhost:3000/api/v1';
  const apiUrl =  'https://api.themoviedb.org/3';
  const apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ODI1MGEyNjQ5YTAwYTk2OTdlYjIxMGUzMTExZGE1YyIsIm5iZiI6MTcyMjU4NzAzNS43MTYsInN1YiI6IjY2YWM5NzliNTEyMTNhZjA5MWJkNThhMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.zrM-3dtjvwa-al-qRd70tlGRD0VkxCFbHgYmZEzY6gA';
const apiOptions = {
  method: 'GET',
  headers : {
    accept: 'application/json',
    Authorization: `Bearer ${apiKey}`
  }
}

const token = localStorage.getItem('jwtToken');

  const [movieDetails, setMovieDetails] = useState([]);
  const [vote, setVote] = useState(0);
  const [date, setDate] = useState("");
  const [credits, setCredits] = useState([]);
  const [cast, setCast] = useState([]);
  const [genre, setGenre] = useState([]);
  const [director, setDirector] = useState([]);
  const [backdrop, setBackdrop] = useState([]);
  const param = useParams();
  const [movies, setMovies] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('user_ID');
  const [likedMovies, setLikedMovies] = useState([]);
  const [likedIcon, setlikedIcon] = useState('');
  const [likedText, setLikedText] = useState("");
  const [likeFunction, setLikeFunction] = useState(() => () => {});
  const [watchList, setWatchList] = useState([]);
  const [listIcon, setListIcon] = useState('');
  const [listText, setListText] = useState("");
  const [listFunction, setListFunction] = useState(() => () => {});
  const [diary, setDiary] = useState([]);
  const [diaryIcon, setDiaryIcon] = useState('');
  const [diaryText, setDiaryText] = useState("");
  const [diaryFunction, setDiaryFunction] = useState(() => () => {});
  const [rate, setRate] = useState([]);
  const [rateIcon, setRateIcon] = useState('');
  const [rateText, setRateText] = useState("");
  const [rateFunction, setRateFunction] = useState(() => () => {});
  const [isActive, setIsActive] = useState(false);
  const [isActive2, setIsActive2] = useState(false);
  const [ratings, setRatings] = useState(0);
  const [review, setReview] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [italic, setItalic] = React.useState(false);
  const [fontWeight, setFontWeight] = React.useState('normal');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [updateCommentID, setUpdateCommentID] = useState(0);
  const [updateComment, setUpdateComment] = useState("");
  const [updateData, setUpdateData] = useState([]);
 
   dayjs.extend(relativeTime);
   
  
  

  const openForm = () => {
    setIsActive(!isActive);
    
  }

  const openUpdateCommentForm = (commentId) => {

    const selectedComment = comments.find(c => c._id === commentId);
    if (selectedComment) {
      setUpdateData({
      comment: selectedComment.comment,
      });
    }
    setIsActive2(!isActive2);
    setUpdateCommentID(commentId);
    
  }

  const handleUpdateCommentChange = async(e) => {
    setUpdateData({ ...updateData, comment: e.target.value });
  }



  const recentRatings = rate.slice(0, 5);

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

              
              setIsActive2(!isActive2);
              e.target.reset();

              getComment();

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

              } catch (error) {
              console.log(error);
              
            }
  }
   
  return (
    <div className="container">
      <Nav />
     

          <div className="user-comment">
            <h2>View Comments</h2>
          
            <div className="comments-section">
            

            {comments?.length === 0 && (
              <p style={{ display: "flex", justifyContent: "center" }}>
                Be the first to comment on this rating.
              </p>
            )}
          
            {comments.map((c) => {
                
                const users = c.userId;
                console.log(comments);

                return(
			<div className="comment-post">
                
                
				<div class="comment-main">
				
					<div class="comment-img"><img className="comment-icon-img" src={`http://localhost:3000/${c.userId.image}`} alt=""/></div>
					
					<div class="comment-details">
							<p><span class="comment-author">{c.userId.username}</span><span class="comment-time">{dayjs(c.updatedAt).fromNow()}</span></p>
							
					
                        
						<div class="comment-content">
							{c.comment}
						</div>

                        



                        <div className="comment-edit-delete" style={c.userId._id == userId ? {display: "flex"} : {display: "none"}}>
                        <button className="edit-comment" onClick={() => {openUpdateCommentForm(c._id, param.ratingId)}}><img className="edit-icon" src="/edit-icon.svg"/> </button>
                            <button className="delete-comment" onClick={() => {deleteComment(c._id)}}><img className="delete-icon" src="/delete-icon.svg"/> </button>
					    </div>
                    </div>

                    
				
				
				
			</div>
           
		</div>
         )})}
    

        
        </div>

        <div className="comment-add">
         <div className="field-comment">
            <textarea name="comment" value={comment} onChange={handleCommentChange} rows="4" cols="50"></textarea>
            <a className="btn btn--blue btn--medium pull-right" onClick={addComment}>Post Your Comment</a>
         </div>
      </div>

         <div className="logForm" style={isActive2 ? {display: "flex"} : {display: "none"}}>
          <h2>Edit Comment</h2>
          <button className="closeBtn" onClick={openUpdateCommentForm}>x</button>
          <form className="log-form" onSubmit={editComment}>
          <textarea className="review_field"  placeholder="Add review..." name="review" value={updateData.comment} onChange={handleUpdateCommentChange} />
          <input className="logBtn" type="submit" value="Edit"/>
          </form>
        </div>
	</div>
    </div>
   
          
       




  )
      
}

      
      


export default Comments