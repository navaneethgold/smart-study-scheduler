import React, { useState } from 'react';
import {
  Box, Button, TextField, Typography, IconButton, Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import {useNavigate} from "react-router-dom";


const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    studying: '',
    subjects: [
      {
        subjectName: '',
        subtopics: ['']
      }
    ]
  });
    const navigate=useNavigate();
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...formData.subjects];
    updatedSubjects[index][field] = value;
    setFormData(prev => ({ ...prev, subjects: updatedSubjects }));
  };

  const handleSubtopicChange = (subjIndex, subIndex, value) => {
    const updatedSubjects = [...formData.subjects];
    updatedSubjects[subjIndex].subtopics[subIndex] = value;
    setFormData(prev => ({ ...prev, subjects: updatedSubjects }));
  };

  const addSubject = () => {
    setFormData(prev => ({
      ...prev,
      subjects: [...prev.subjects, { subjectName: '', subtopics: [''] }]
    }));
  };

  const addSubtopic = (index) => {
    const updatedSubjects = [...formData.subjects];
    updatedSubjects[index].subtopics.push('');
    setFormData(prev => ({ ...prev, subjects: updatedSubjects }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/signup", formData, {
        withCredentials: true
      });
      alert("Signup successful!");
      navigate("/profile");
    } catch (error) {
      console.error(error);
      alert("Signup failed.");
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Sign Up</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Username (Email)"
          name="username"
          value={formData.username}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Studying (e.g., BTech CSE)"
          name="studying"
          value={formData.studying}
          onChange={handleChange}
          margin="normal"
          required
        />

        {formData.subjects.map((subject, subjIndex) => (
          <Box key={subjIndex} sx={{ mt: 3, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
            <TextField
              fullWidth
              label={`Subject ${subjIndex + 1} Name`}
              value={subject.subjectName}
              onChange={(e) =>
                handleSubjectChange(subjIndex, 'subjectName', e.target.value)
              }
              required
            />
            <Typography variant="subtitle1" sx={{ mt: 2 }}>Subtopics:</Typography>
            {subject.subtopics.map((subtopic, subIndex) => (
              <TextField
                key={subIndex}
                fullWidth
                label={`Subtopic ${subIndex + 1}`}
                value={subtopic}
                onChange={(e) =>
                  handleSubtopicChange(subjIndex, subIndex, e.target.value)
                }
                sx={{ mt: 1 }}
                required
              />
            ))}
            <Button
              variant="text"
              startIcon={<AddIcon />}
              onClick={() => addSubtopic(subjIndex)}
              sx={{ mt: 1 }}
            >
              Add Subtopic
            </Button>
          </Box>
        ))}

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addSubject}
          sx={{ mt: 3 }}
        >
          Add Another Subject
        </Button>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 4 }}
        >
          Register
        </Button>
      </form>
    </Box>
  );
};

export default Signup;
