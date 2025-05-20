// import React, { useState, useEffect } from 'react';

// export default function TimerComponent() {
//   const [timeLeft, setTimeLeft] = useState(0); // in seconds
//   const [isRunning, setIsRunning] = useState(false);

//   useEffect(() => {
//     let interval;

//     if (isRunning && timeLeft > 0) {
//       interval = setInterval(() => {
//         setTimeLeft(prev => prev - 1);
//       }, 1000);
//     } else if (timeLeft === 0) {
//       clearInterval(interval);
//       setIsRunning(false);
//     }

//     return () => clearInterval(interval); // cleanup
//   }, [isRunning, timeLeft]);

//   const startTimer = () => {
//     setTimeLeft(30 * 60); // 30 minutes in seconds
//     setIsRunning(true);
//   };

//   // Format to mm:ss
//   const formatTime = () => {
//     const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
//     const seconds = String(timeLeft % 60).padStart(2, '0');
//     return `${minutes}:${seconds}`;
//   };

//   return (
//     <div>
//       <h3>{formatTime()}</h3>
//       <button onClick={startTimer} disabled={isRunning}>
//         Start a Pomodoro
//       </button>
//     </div>
//   );
// }
