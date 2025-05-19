import React, { useState } from 'react';
import {
  Box, TextField, Typography, IconButton, Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import {useNavigate,useLocation} from "react-router-dom";
import "../styling/login.css"
// import TextField from '@mui/material/TextField';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';

const Login = () => {
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
    const navigate=useNavigate();
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/login", formData, {
        withCredentials: true
      });
      alert("Login successful!");
      navigate(from,{replace:true});
    } catch (error) {
      console.error(error);
      alert("Login failed.");
    }
  };

  return (
    <div className="outer">
    <div className="card">
    {/* // <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}> */}
      <h1 className='heading'>Login to TimeTuner</h1>
      <form onSubmit={handleSubmit}>
        <Box sx={{display:'flex',justifyContent:'center',flexDirection:'column',alignItems:'center'}}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end',padding:'10px' }}>
            <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField id="input-with-sx" label="Username" variant="standard" name="username" value={formData.username} onChange={handleChange} required style={{width:'500px'}} color='#273F4F'/>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 2 ,padding:'10px'}}>
              <LockIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
              <TextField
                id="password-input"
                label="Password"
                type="password"
                variant="standard"
                name="password"
                color='#273F4F'
                value={formData.password}
                onChange={handleChange}
                required
                style={{ width: '500px' }}
              />
          </Box>
          
          <button
            type="submit"
            style={{width:'400px'}}
            className='sub'
          >
            Login
          </button>
        </Box>
        
      </form>
    {/* // </Box> */}
    </div>
    </div>
  );
};

export default Login;
