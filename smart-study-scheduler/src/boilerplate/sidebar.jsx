import {Link,useNavigate} from "react-router-dom";
import "./sidebar.css";
import { useState,useEffect } from "react";
import axios from "axios";
import { Home, FilePlus, ClipboardList, User, Settings } from 'lucide-react';
export default function Sidebar(){
    const navigate=useNavigate();
    const [isLogged,setIsLogged]=useState(null);
    const [userdata,setUserdata]=useState({});
    useEffect(()=>{
    const checkAuth=async()=>{
      try{
        const res= await axios.get(`${import.meta.env.VITE_API_BASE_URL}/check-auth`,{
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
                  <div className="icones"><Home size={20} /></div>
                  <div className="labeles">
                    <h4>Home</h4>
                  </div>
                </div>

                <div className="newexam" onClick={hnewexam}>
                  <div className="icones"><FilePlus size={20} /></div>
                  <div className="labeles">
                    <h4>New Exam</h4>
                  </div>
                </div>

                <div className="newtask" onClick={hnewtask}>
                  <div className="icones"><ClipboardList size={20} /></div>
                  <div className="labeles">
                    <h4>New Task</h4>
                  </div>
                </div>

                <div className="profile" onClick={hprofile}>
                  <div className="icones"><User size={20} /></div>
                  <div className="labeles">
                    <h4>Profile</h4>
                  </div>
                </div>

                <div className="settings" onClick={settings}>
                  <div className="icones"><Settings size={20} /></div>
                  <div className="labeles">
                    <h4>Settings</h4>
                  </div>
                </div>
            {/* </div> */}
                
                
        </div>
        </>
    );
}