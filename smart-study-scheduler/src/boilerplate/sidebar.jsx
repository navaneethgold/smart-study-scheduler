import {Link} from "react-router-dom";
import "./sidebar.css";
export default function Sidebar(){
    return(
        <div className="sidebar">
            {/* <ul> */}
                <div className="home">
                    <li><Link to="/">Home</Link></li>
                </div>
                <div className="newexam">
                    <li><Link to="/newexam">New Exam</Link></li>
                </div>
                <div className="newtask">
                    <li><Link to="/add-task">New Task</Link></li>
                </div>
                <div className="profile">
                    <li><Link to="/profile">Profile</Link></li>
                </div>
                <div className="settings">
                    <li><Link to="/settings">Settings</Link></li>
                </div>
                
            {/* </ul> */}
        </div>
    );
}