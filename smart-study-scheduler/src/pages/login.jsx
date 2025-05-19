import React, { useState } from 'react';
import {
  Box, Button, TextField, Typography, IconButton, Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import {useNavigate,useLocation} from "react-router-dom";


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
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Login</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Username (Email)"
          name="username"
          value={formData.username}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
          required
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 4 }}
        >
          Login
        </Button>
      </form>
    </Box>
  );
};

export default Login;
