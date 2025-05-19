import React,{useState,useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Logout from "./logout";
const Myprofile=()=>{
    const [isLogged, setIsLogged] = useState(null);
    const [userdata, setUserdata] = useState({});
    const navigate=useNavigate();
    useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5000/check-auth", {
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
  }, []);
    const signup=()=>{
        navigate("/signup");
    }
    const logins=()=>{
        navigate("/login");
    }
    return(
        <>
          {isLogged ? (
            <div>
              <h2>Welcome, {userdata.username}!</h2>
              <p>Studying: {userdata.studying}</p>
              <Logout/>
            </div>
          ) : (
            <>
              <button onClick={signup}>Signup</button>
              <button onClick={logins}>Login</button>
            </>
          )}
        </>
        
    )
}
export default Myprofile;