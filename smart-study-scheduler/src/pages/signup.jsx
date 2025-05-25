import React, { useState } from 'react';
import {
  Box, Button, TextField, Typography, IconButton, Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import "../styling/signup.css";

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
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/signup`, formData, {
        withCredentials: true
      });
      alert("Signup successful!");
      navigate("/profile");
    } catch (error) {
      console.error(error);
      alert("Signup failed.");
    }
  };
  const sredirec=()=>{
    navigate("/login");
  }

  return (
    <div className='spage'>
      <div className="slogo">
        <div className="simg"><img src="/Icon.png" alt="icon" id='sicon'/></div>
        <div className="stxts">
          <div className="stxt5">
            <div id='stext6'>Welcome to TimeTuner</div>
          </div>
          <div className="stxt1">
            <div id='stext7'>Where Your Time Meets Precision</div>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="all-shit">
          <h2 className='talakai'><img src="/Icon.png" alt="icon" id='inka' />Sign Up</h2>
          <div className="sinp">
          {/* Headings Section */}
          <div className="side-headings">
            <div className="sh1">UserName</div>
            <div className="sh1">Password</div>
            <div className="sh1">Studying (e.g., BTech CSE)</div>
          </div>

          {/* Inputs Section */}
          <div className="inputs-section">
            <div className="sinp1">
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="sinp1">
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="sinp1">
              <input
                name="studying"
                value={formData.studying}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="sall-subs">
          {formData.subjects.map((subject, subjIndex) => (
            <div key={subjIndex} className='tala-sign'>

              {/* Subject Name Heading + Input */}
              <div className="subname">
                <div className="sub-headings">Subject {subjIndex + 1} Name</div>
                <input
                  value={subject.subjectName}
                  onChange={(e) =>
                    handleSubjectChange(subjIndex, 'subjectName', e.target.value)
                  }
                  required
                />
              </div>
                
              {/* Subtopics Heading + Inputs */}
              <div className="all-subs">
                <div className="sub-headings">Subtopics</div>
                {subject.subtopics.map((subtopic, subIndex) => (
                  <div key={subIndex} className="sub-inp">
                    <div className="sub-subheadings">Subtopic {subIndex + 1}</div>
                    <input
                      value={subtopic}
                      onChange={(e) =>
                        handleSubtopicChange(subjIndex, subIndex, e.target.value)
                      }
                      required
                    />
                  </div>
                ))}
              </div>
              
              {/* Add Subtopic Button */}
              <div className="add-but-sub">
                <button
                  className='mybut'
                  onClick={() => addSubtopic(subjIndex)}
                >
                  <div className="amma"><AddIcon/>Add Subtopic</div>
                </button>
              </div>
              
            </div>
          ))}

        </div>
        
        <div className="all-buts">
          <button
            className='mybut'
            onClick={addSubject}
          >
            <div className="amma"><AddIcon/>Add Subject</div>
          </button>

          <button
            type="submit"
            className='mybut2'
          >
            Register
          </button>
        </div>
        <div className="sredir">
            Already have an account?
            <a onClick={sredirec} id='sredirect'>
              Login
            </a>
        </div>
        </div>
        
        
      </form>
    </div>
  );
};

export default Signup;
