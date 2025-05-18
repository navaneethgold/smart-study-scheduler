import React,{useState,useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
const Myprofile=()=>{
    const [userdata,setUserdata]=useState({
        username:"",
        studying:"",
        subjects:""
    });
    const navigate=useNavigate();
    const signup=()=>{
        navigate("/signup");
    }
    return(
        <button onClick={signup}>Signup</button>
    )
}
export default Myprofile;