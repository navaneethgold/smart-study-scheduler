import React,{useState,useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Logout from "./logout";
import "../styling/profile.css";
const Myprofile=()=>{
  const[userData,setuserData]=useState({});
  const[isLogged,setIsLogged]=useState(null);
  const navigate=useNavigate();
  useEffect(()=>{
    const checkAuth=async()=>{
      try{
        const res=await axios(`${import.meta.env.VITE_API_BASE_URL}/check-auth`,{
          withCredentials:true,
        });
        if(res.data.isAuthenticated){
          setuserData(res.data.user);
          setIsLogged(true);
        }else{
          setIsLogged(false);
        }
      }catch(err){
        console.error("Auth check failed", err);
      }
    };
    checkAuth();
  },[]);
  
    return(
        <div className="alldata">
  {isLogged ? (
    <div className="cards">
      {userData && (
        <>
          <div className="top-row">
            <h1 className="main-heading">Welcome, {userData.username}!</h1>
            <div id="logout">
              <Logout />
            </div>
          </div>
          <h2 className="sub-heading">Currently Studying</h2>
          <div className="content-box">{userData.studying}</div>

          <h2 className="sub-heading">Your Subjects</h2>
          <div className="subjects-box">
            <ul>
              {userData.subjects.map((sub, index) => (
                <li key={index}>
                  <span className="subject-title">{sub.subjectName}</span>
                  <ul className="subtopics-list">
                    {sub.subtopics.map((subt, ind) => (
                      <li key={ind}>{subt}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  ) : (
    <h1>Not Logged In</h1>
  )}
</div>

        
    )
}
export default Myprofile;