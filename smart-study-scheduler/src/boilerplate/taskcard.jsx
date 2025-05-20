import React, { useState, useEffect } from 'react';
import "../styling/taskcard.css"
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import FormatListNumberedRoundedIcon from '@mui/icons-material/FormatListNumberedRounded';
import AccessAlarmRoundedIcon from '@mui/icons-material/AccessAlarmRounded';
import TimerRoundedIcon from '@mui/icons-material/TimerRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
export default function TaskCard({ task }) {
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
    const [isRunning, setIsRunning] = useState(false);
  
    useEffect(() => {
      let interval;
  
      if (isRunning && timeLeft > 0) {
        interval = setInterval(() => {
          setTimeLeft(prev => prev - 1);
        }, 1000);
      } else if (timeLeft === 0) {
        clearInterval(interval);
        setIsRunning(false);
      }
  
      return () => clearInterval(interval); // cleanup
    }, [isRunning, timeLeft]);
  
    const startTimer = () => {
      setTimeLeft(30 * 60); // 30 minutes in seconds
      setIsRunning(true);
    };
  
    // Format to mm:ss
    const formatTime = () => {
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
            <div  className='label'><ImportContactsIcon fontSize="small" style={{ marginRight: '4px' }}/>Subject:</div>
            <div  className='label'><FormatListNumberedRoundedIcon fontSize="small" style={{ marginRight: '4px' }}/>Chapter:</div>
            <div  className='label'><AccessAlarmRoundedIcon fontSize="small" style={{ marginRight: '4px' }}/>Duration:</div>
            <div  className='label'><TimerRoundedIcon fontSize="small" style={{ marginRight: '4px' }}/>Pomodoros:</div>
            <div  className='label'><PendingActionsRoundedIcon fontSize="small" style={{ marginRight: '4px' }}/>Status:</div>
            
          </div>
          <div className="info-values">
            <div  className='value'>{task.subject}</div>
            <div  className='value'>{task.chapter}</div>
            <div  className='value'>{task.durationInMin} min</div>
            <div  className='value'>{task.approxpomo}</div>
            <div  className='value'>{task.done ? "Completed ✅" : "Pending ⏳"}</div>
          </div>
        </div>
        <div id="but">
          <button onClick={startTimer} disabled={isRunning}>
            Start a Pomodoro
          </button>
        </div>
      </div>
      <div className="timer">
        <h1>{formatTime()}</h1>
      </div>
      </div>
      
      
    </div>
  );
}
