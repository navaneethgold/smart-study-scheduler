import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskCard from '../boilerplate/taskcard';
import { useNavigate } from 'react-router-dom';
import "../styling/home.css";

export default function Home() {
  const navigate=useNavigate();
  const [tasks, setTasks] = useState([]);
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
  console.log(isLogged);
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/tasks", {
            withCredentials: true, // ✅ this sends the session cookie
        });
        setTasks(res.data);
        // console.log(res.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    if(isLogged){
      fetchTasks();
    }
    
  }, [isLogged]);
  const signup=()=>{
        navigate("/signup");
    }
    const logins=()=>{
        navigate("/login");
    }
  return (
    <>
      
      <div className="remain">
        <div style={{ padding: "20px" }} id="all">
          {tasks.map(task => (
            <TaskCard key={task._id} task={task} />
          ))}
      </div>
      </div>
      
    </>
  );
}
