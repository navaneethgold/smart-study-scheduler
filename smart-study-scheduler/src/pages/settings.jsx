import React, { useState,useEffect } from 'react';
import {
  Box, Button, TextField, Typography, IconButton, Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import {useNavigate} from "react-router-dom";


const Signup = () => {
  const [subjects,setsubjects]=useState({});
  const [isLogged,setislogged]=useState(false);
  const [usedata,setUserdata]=useState({});
  useEffect(()=>{
    const navigate=useNavigate();
    const checkAuth=async()=>{
        try{
        const res=await axios.get("http://localhost:5000/check-auth",{
          withCredentials:true,
        });
        setislogged(res.data.isAuthenticated);
        if(res.data.isAuthenticated){
          setUserdata(res.data.user);
        }else{
          navigate("/login");
        }
      }catch (err) {
        console.error("Auth check failed", err);
        setislogged(false);
      }
    }
    checkAuth();
  },[])
  

  return (
    <></>
  );
};

export default Signup;
