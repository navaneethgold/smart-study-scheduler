import {Link,useNavigate} from "react-router-dom";
import "./sidebar.css";
import { useState,useEffect } from "react";
import axios from "axios";
export default function Sidebar(){
    const navigate=useNavigate();
    const [isLogged,setIsLogged]=useState(null);
    const [userdata,setUserdata]=useState({});
    useEffect(()=>{
    const checkAuth=async()=>{
      try{
        const res= await axios.get("http://localhost:5000/check-auth",{
          withCredentials: true,
        });
        setIsLogged(res.data.isAuthenticated);
        if (res.data.isAuthenticated) {
          setUserdata(res.data.user); // optional: show user info
        }
      } catch (err) {
        console.error("Auth check failed", err);
        setIsLogged(false);
      }
    };
    checkAuth();
  },[]);
    const hhome=()=>{
        navigate("/")
    }
    const hnewexam=()=>{
        navigate("/newexam")
    }
    const hnewtask=()=>{
        navigate("/add-task")
    }
    const hprofile=()=>{
        navigate("/profile")
    }
    const signup=()=>{
        navigate("/signup");
    }
    const logins=()=>{
        navigate("/login");
    }
    const settings=()=>{
      navigate("/settings");
    }
    return(
        <>
        <div className="head">
        {isLogged ? (
            <div className='head2'>
              <h2>Welcome, {userdata.username}!</h2>
              <p>{userdata.studying}</p>
            </div>
          ) : (
            <div className='sl'>
              <div className='log' onClick={signup}>Signup/</div>
              <div className='log' onClick={logins}>Login</div>
            </div>
          )}
      </div>
        <div className="sidebar">
                <div className="icon" onClick={hhome}>
                    <div className="ic"><img src="/Icon.png" alt="icon" className="icon2"/></div>
                    <div id="txt"><h3 id="txt2">TimeTuner</h3></div>
                </div>
                <div className="home" onClick={hhome}>
                    <h4>Home</h4>
                </div>
                <div className="newexam" onClick={hnewexam}>
                    <h4>New Exam</h4>
                </div>
                <div className="newtask" onClick={hnewtask}>
                    <h4>New Task</h4>
                </div>
                <div className="profile" onClick={hprofile}>
                    <h4>Profile</h4>
                </div>
                <div className="settings" onClick={settings}>
                    <h4>Settings</h4>
                </div>
            {/* </div> */}
                
                
        </div>
        </>
    );
}