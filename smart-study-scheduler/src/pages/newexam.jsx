import React, { useEffect, useState } from "react";
import axios from "axios";
import { Checkbox, FormControlLabel, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NewExam = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/user/subjects", { withCredentials: true })
      .then(res => {
        const initialSelection = {};
        res.data.forEach(sub => {
          initialSelection[sub.subjectName] = {
            checked: false,
            subtopics: sub.subtopics.map(topic => ({ name: topic, checked: false }))
          };
        });
        setSubjects(res.data);
        setSelectedSubjects(initialSelection);
      })
      .catch(err => {
        console.error(err);
        navigate("/login"); // redirect if not authenticated
      });
  }, []);

  const toggleSubject = (subjectName) => {
    const updated = { ...selectedSubjects };
    const subject = updated[subjectName];
    const newChecked = !subject.checked;
    subject.checked = newChecked;
    subject.subtopics = subject.subtopics.map(t => ({ ...t, checked: newChecked }));
    setSelectedSubjects(updated);
  };

  const toggleSubtopic = (subjectName, idx) => {
    const updated = { ...selectedSubjects };
    updated[subjectName].subtopics[idx].checked = !updated[subjectName].subtopics[idx].checked;

    // if any subtopic is unchecked, parent subject is unchecked
    updated[subjectName].checked = updated[subjectName].subtopics.every(t => t.checked);
    setSelectedSubjects(updated);
  };

//   const generatePlan = () => {
//     const selectedData = Object.entries(selectedSubjects).map(([subject, data]) => ({
//       subject,
//       subtopics: data.subtopics.filter(st => st.checked).map(st => st.name)
//     })).filter(s => s.subtopics.length > 0);

//     console.log("Study Plan:", selectedData);

//     // send to backend or store in context/state
//   };

  return (
    <Box sx={{ mx: 'auto', mt: 4, width: "80%" }}>
      <Typography variant="h4" gutterBottom>Choose Topics for Exam</Typography>
      {Object.entries(selectedSubjects).map(([subjectName, data], idx) => (
        <Box key={idx} sx={{ mb: 2, pl: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={data.checked}
                onChange={() => toggleSubject(subjectName)}
              />
            }
            label={<strong>{subjectName}</strong>}
          />
          <Box sx={{ pl: 4 }}>
            {data.subtopics.map((sub, i) => (
              <FormControlLabel
                key={i}
                control={
                  <Checkbox
                    checked={sub.checked}
                    onChange={() => toggleSubtopic(subjectName, i)}
                  />
                }
                label={sub.name}
              />
            ))}
          </Box>
        </Box>
      ))}
      <Button variant="contained" color="primary">Generate Study Plan</Button>
    </Box>
  );
};

export default NewExam;
