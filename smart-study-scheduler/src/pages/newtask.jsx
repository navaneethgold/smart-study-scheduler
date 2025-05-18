// src/components/AddTaskForm.jsx
import React, { useState } from "react";
import axios from "axios";

const AddTaskForm = () => {
  const [formData, setFormData] = useState({
    subject: "",
    chapter: "",
    durationInMin: "",
    approxpomo: ""
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        ...formData,
        durationInMin: Number(formData.durationInMin),
        approxpomo: Number(formData.approxpomo)
      };
      await axios.post("http://localhost:5000/add", taskData);
      alert("Task added successfully");
      setFormData({ subject: "", chapter: "", durationInMin: "", approxpomo: "" });
    } catch (err) {
      console.error("Error adding task", err);
      alert("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: "1rem" }}>
      <input name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} required />
      <input name="chapter" placeholder="Chapter" value={formData.chapter} onChange={handleChange} required />
      <input name="durationInMin" type="number" placeholder="Duration (minutes)" value={formData.durationInMin} onChange={handleChange} required />
      <input name="approxpomo" type="number" placeholder="Pomodoros" value={formData.approxpomo} onChange={handleChange} required />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default AddTaskForm;
