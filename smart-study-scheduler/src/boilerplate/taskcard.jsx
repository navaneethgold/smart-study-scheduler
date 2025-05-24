import React, { useState, useEffect } from 'react';
import "../styling/taskcard.css";
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import FormatListNumberedRoundedIcon from '@mui/icons-material/FormatListNumberedRounded';
import AccessAlarmRoundedIcon from '@mui/icons-material/AccessAlarmRounded';
import TimerRoundedIcon from '@mui/icons-material/TimerRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import axios from 'axios';

export default function TaskCard({ task }) {
  const initialTime = task.endTime 
    ? Math.floor((new Date(task.endTime) - Date.now()) / 1000)
    : 0;

  const [timeLeft, setTimeLeft] = useState(initialTime > 0 ? initialTime : 0);
  const [isRunning, setIsRunning] = useState(initialTime > 0);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          endTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const startTimer = async () => {
    if(task.approxpomo<=0){
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/${task._id}/complete`,{},{withCredentials: true, });
      return;
    }
    if (!task.endTime) {
      try {
        const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/${task._id}/setEnd`,{},{withCredentials: true, });
        const updatedEndTime = new Date(response.data.endTime);
        const timeInSec = Math.floor((updatedEndTime - Date.now()) / 1000);
        setTimeLeft(timeInSec);
        setIsRunning(true);
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          alert(error.response.data.message);  // 🔔 Show alert with message from backend
        } else {
          alert("An unexpected error occurred."); // 🔔 Fallback error
        }
      }
    } else {
      const remaining = Math.floor((new Date(task.endTime) - Date.now()) / 1000);
      if (remaining <= 0) {
        await endTimer();
        setTimeLeft(0);
        setIsRunning(false);
      } else {
        setTimeLeft(remaining);
        setIsRunning(true);
      }
    }
  };

  const endTimer = async () => {
    await axios.put(`${import.meta.env.VITE_API_BASE_URL}/${task._id}/clearEnd`,{},{withCredentials: true, });
    await axios.put(`${import.meta.env.VITE_API_BASE_URL}/${task._id}/pomo-complete`,{},{withCredentials: true, });
  };

  const formatTime = () => {
    if (isNaN(timeLeft) || timeLeft < 0) return "00:00";
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const seconds = String(timeLeft % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div id="mybox">
      <div id="mycard">
        <div id="outer">
          <div className="inner">
            <div className="info-labels">
              <div className="label"><ImportContactsIcon fontSize="small" style={{ marginRight: '4px' }} />Subject:</div>
              <div className="label"><FormatListNumberedRoundedIcon fontSize="small" style={{ marginRight: '4px' }} />Chapter:</div>
              <div className="label"><AccessAlarmRoundedIcon fontSize="small" style={{ marginRight: '4px' }} />Duration:</div>
              <div className="label"><TimerRoundedIcon fontSize="small" style={{ marginRight: '4px' }} />Pomodoros:</div>
              <div className="label"><PendingActionsRoundedIcon fontSize="small" style={{ marginRight: '4px' }} />Status:</div>
            </div>
            <div className="info-values">
              <div className="value">{task.subject}</div>
              <div className="value">{task.chapter}</div>
              <div className="value">{task.durationInMin} min</div>
              <div className="value">{task.approxpomo}</div>
              <div className="value">{task.done ? "Completed ✅" : "Pending ⏳"}</div>
            </div>
          </div>
          <div id="but">
            <button onClick={startTimer} disabled={isRunning} id='poms'>
              Start a Pomodoro
            </button>
            <div className="timerrs">
              <h1>{formatTime()}</h1>
            </div>
          </div>
        </div>
        <div className="timer">
          <h1>{formatTime()}</h1>
        </div>
      </div>
    </div>
  );
}
