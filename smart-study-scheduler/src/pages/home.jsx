import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskCard from '../boilerplate/taskcard';
import { useNavigate } from 'react-router-dom';

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

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/tasks"); // adjust port if needed
        setTasks(res.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    fetchTasks();
  }, []);
  const signup=()=>{
        navigate("/signup");
    }
    const logins=()=>{
        navigate("/login");
    }
  return (
    <>
      <div className="head">
        {isLogged ? (
            <div>
              <h2>Welcome, {userdata.username}!</h2>
              <p>Studying: {userdata.studying}</p>
            </div>
          ) : (
            <>
              <button onClick={signup}>Signup</button>
              <button onClick={logins}>Login</button>
            </>
          )}
      </div>
      <div style={{ padding: "20px" }}>
        {tasks.map(task => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>
    </>
  );
}
