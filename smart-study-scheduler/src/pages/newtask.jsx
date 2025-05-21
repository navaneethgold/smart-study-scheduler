// src/components/AddTaskForm.jsx
import React, { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styling/newtask.css"
const AddTaskForm = () => {
  const [isLogged,setIsLogged]=useState(null);
  const [userData,setUserdata]=useState({});
  const navigate=useNavigate();
  useEffect(()=>{
    const checkAuth=async()=>{
      try{
        const res=await axios.get("http://localhost:5000/check-auth",{
          withCredentials:true,
        });
        setIsLogged(res.data.isAuthenticated);
        if(res.data.isAuthenticated){
          setUserdata(res.data.user);
        }else{
          navigate("/login");
        }
      }catch (err) {
        console.error("Auth check failed", err);
        setIsLogged(false);
      }
    };
    checkAuth();
  },[]);
  const [formData, setFormData] = useState({
    subject: "",
    chapter: "",
    durationInMin: "",
    approxpomo: ""
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      let tasks = {
        ...formData,
        durationInMin: Number(formData.durationInMin),
        approxpomo: Number(formData.approxpomo),
        done:false
      };
      console.log(tasks);
      tasks=[tasks];
      await axios.post("http://localhost:5000/add", tasks, { headers: {
    "Content-Type": "application/json"
  },withCredentials: true });
      alert("Task added successfully");
      setFormData({ subject: "", chapter: "", durationInMin: "", approxpomo: "" });
    } catch (err) {
      console.error("Error adding task", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="manual">
  <div className="caard">
    <div className="top">Add Task Manually</div>

    <form onSubmit={handleSubmit} style={{ padding: "1rem" }}>
      <div className="form-fields">
        <div className="input-group">
          <label htmlFor="subject">Subject:</label>
          <input
            id="subject"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="chapter">Chapter:</label>
          <input
            id="chapter"
            name="chapter"
            placeholder="Chapter"
            value={formData.chapter}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="duration">Duration:</label>
          <input
            id="duration"
            name="durationInMin"
            type="number"
            placeholder="Duration (minutes)"
            value={formData.durationInMin}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="pomodoros">Pomodoros:</label>
          <input
            id="pomodoros"
            name="approxpomo"
            type="number"
            placeholder="Pomodoros"
            value={formData.approxpomo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="but">
          <button type="submit">➕ Add Task</button>
        </div>
      </div>
    </form>
  </div>
</div>


    
  );
};

export default AddTaskForm;
