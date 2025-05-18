import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskCard from '../boilerplate/taskcard';

export default function Home() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/tasks"); // adjust port if needed
        setTasks(res.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      {tasks.map(task => (
        <TaskCard key={task._id} task={task} />
      ))}
    </div>
  );
}
