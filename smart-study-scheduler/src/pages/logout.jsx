import React from 'react';
import axios from 'axios';
import { useNavigate,useLocation } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate(); // ← You forgot this
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/logout", {}, {
        withCredentials: true,
      });
      alert("Logout successful!");
      navigate(from,{replace:true});
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed.");
    }
  };

  return (
    <button onClick={handleLogout} id='logout'>Logout</button>
  );
};

export default Logout;
