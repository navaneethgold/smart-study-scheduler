import {Link,useNavigate} from "react-router-dom";
import "./sidebar.css";
export default function Sidebar(){
    const navigate=useNavigate();
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
    return(
        <div className="sidebar">
                <div className="icon">
                    <img src="/Icon.png" alt="icon" className="icon2"/>
                </div>
                <div className="home" onClick={hhome}>
                    <h4>Home</h4>
                </div>
                <div className="newexam" onClick={hnewexam}>
                    <h4>New Exam</h4>
                </div>
                <div className="newtask" onClick={hnewtask}>
                    <h4>New Task</h4>
                </div>
                <div className="profile" onClick={hprofile}>
                    <h4>Profile</h4>
                </div>
                <div className="settings">
                    <h4>Settings</h4>
                </div>
            {/* </div> */}
                
                
        </div>
    );
}