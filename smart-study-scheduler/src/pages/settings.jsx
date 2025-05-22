import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styling/settings.css';

const Settings = () => {
  const [usedata, setUserdata] = useState({ username: '', subjects: [] });
  const [isLogged, setislogged] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('http://localhost:5000/check-auth', {
          withCredentials: true,
        });
        setislogged(res.data.isAuthenticated);
        if (res.data.isAuthenticated) {
          setUserdata(res.data.user);
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error('Auth check failed', err);
        setislogged(false);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleDeleteSubject = async (index) => {
    try {
      await axios.delete(`http://localhost:5000/${usedata.username}/${index}/delete`);
      const updatedSubjects = usedata.subjects.filter((_, i) => i !== index);
      setUserdata((prev) => ({ ...prev, subjects: updatedSubjects }));
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  };

  const handleDeleteSubtopic = (subjectIndex, subtopicIndex) => {
    const updatedSubjects = [...usedata.subjects];
    updatedSubjects[subjectIndex].subtopics = updatedSubjects[subjectIndex].subtopics.filter(
      (_, i) => i !== subtopicIndex
    );
    setUserdata((prev) => ({ ...prev, subjects: updatedSubjects }));
  };

  const addSubject = () => {
    setUserdata((prev) => ({
      ...prev,
      subjects: [...prev.subjects, { subjectName: '', subtopics: [''] }],
    }));
  };

  const addSubtopic = (subjectIndex) => {
    const updatedSubjects = [...usedata.subjects];
    updatedSubjects[subjectIndex].subtopics.push('');
    setUserdata((prev) => ({ ...prev, subjects: updatedSubjects }));
  };

  const handleSubjectChange = (index, value) => {
    const updatedSubjects = [...usedata.subjects];
    updatedSubjects[index].subjectName = value;
    setUserdata((prev) => ({ ...prev, subjects: updatedSubjects }));
  };

  const handleSubtopicChange = (subjIndex, subIndex, value) => {
    const updatedSubjects = [...usedata.subjects];
    updatedSubjects[subjIndex].subtopics[subIndex] = value;
    setUserdata((prev) => ({ ...prev, subjects: updatedSubjects }));
  };

  const handleSave = async () => {
    try {
      console.log(usedata.subjects);
      await axios.put(`http://localhost:5000/${usedata.username}/update-subjects`, {
        subjects: usedata.subjects,
      });
      alert('Subjects updated successfully!');
    } catch (err) {
      console.error('Failed to update subjects:', err);
      alert('Failed to update subjects.');
    }
  };

  return (
    <div className='allsubs'>
      <div className='allval'>
        {usedata.subjects.map((subt, index) => (
          <div key={index} className='each'>
            <div className='subject-header'>
              <div className="sn">Subject Name: </div>
              <input
                type='text'
                value={subt.subjectName}
                id='should'
                onChange={(e) => handleSubjectChange(index, e.target.value)}
                className='subject-heading-input'
              />
              <button className='del-btn' onClick={() => handleDeleteSubject(index)}>
                Delete
              </button>
            </div>
            <div className='subtopic-list'>
                  {/* <div className="allsu"> */}
              {subt.subtopics.map((st, ind) => (
                <div key={ind} className='subtopic-item'>
                  <div className="sn">Chapter {ind+1} name</div>
                  <input
                    type='text'
                    value={st}
                    id='should'
                    onChange={(e) => handleSubtopicChange(index, ind, e.target.value)}
                  />
                  <button
                    className='del-btn small'
                    onClick={() => handleDeleteSubtopic(index, ind)}
                  >
                    Delete
                  </button>
                </div>
              ))}
              {/* </div> */}
            </div>
            <button className='add-subject-btn' onClick={() => addSubtopic(index)}>
              + Add Subtopic
            </button>
          </div>
        ))}

        <div className='add-subject-container'>
          <button className='add-subject-btn' onClick={addSubject}>
            + Add New Subject
          </button>
        </div>

        <div className='add-subject-container'>
          <button className='add-subject-btn' onClick={handleSave}>
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
