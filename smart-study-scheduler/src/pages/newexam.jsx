import React, { useEffect, useState } from "react";
import axios from "axios";
import { Checkbox, FormControlLabel, Button, Box, Typography, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../styling/newexam.css";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
const NewExam = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState({});
  const navigate = useNavigate();
  const [isLogged,setIsLogged]=useState(null);
  const [userData,setUserdata]=useState({});
  const [summaryText, setSummaryText] = useState("");
  const [examDate, setExamDate] = useState("");
  const [hoursperday, setHoursPerDay] = useState("");

  useEffect(()=>{
    const checkAuth=async()=>{
      try{
        const res=await axios.get("http://localhost:5000/check-auth",{
          withCredentials:true,
        });
        setIsLogged(res.data.isAuthenticated);
        if(res.data.isAuthenticated){
          setUserdata(res.data.user);
        }else{
          navigate("/login");
        }
      }catch (err) {
        console.error("Auth check failed", err);
        setIsLogged(false);
      }
    };
    checkAuth();
  },[]);


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
      });
  }, []);
  useEffect(() => {
      if (subjects.length > 0) {
        summarizeit();
      }
    }, [subjects]);

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

  const generatePlan = async () => {
  const selectedData = Object.entries(selectedSubjects).map(([subject, data]) => ({
    subject,
    subtopics: data.subtopics.filter(st => st.checked).map(st => st.name)
  })).filter(s => s.subtopics.length > 0);

  const date = examDate;
  const perday = hoursperday + " hours";
  try {
    const response = await axios.post(
      "http://localhost:5000/generate-plan",
      { selectedData, date, perday },
      { withCredentials: true }
    );
    
    const data = response.data;
    let generatedTasks = data.plan; // assuming backend returns { tasks: [...] }
    console.log("ide na:",generatedTasks);
      await axios.post("http://localhost:5000/add", generatedTasks, { headers: {
    "Content-Type": "application/json"
  },withCredentials: true });
  // });

    alert("Study plan generated and saved successfully!");

  } catch (error) {
    console.error("Error generating or saving study plan:", error);
    alert("Something went wrong while generating or saving the study plan.");
  }
};

const summarizeit=async()=>{
  const allSubjects = subjects.map(subject => ({
    subject: subject.subjectName,
    subtopics: subject.subtopics
  }));

   try {
    const response = await axios.post("http://localhost:5000/summarize", {
      allSubjects,
    }, { withCredentials: true });

    // alert("Motivational summary generated!");
    console.log(response.data.summary); // Show this in UI if needed
    setSummaryText(response.data.summary);

  } catch (err) {
    console.error("Failed to generate summary:", err);
  }
}


  return (
    <div id="exam">
      <div id="out">
      <div id="inside">
      <div id="cont"><h2>Choose Topics for Exam</h2></div>
      <Box sx={{ mb: 2 }} className="input-pair">
            <TextField
              type="date"
              label="Exam Date"
              // InputLabelProps={{ shrink: true }}
              placeholder="Exam date"
              value={examDate}
              color="white"
              onChange={(e) => setExamDate(e.target.value)}
              sx={{ mr: 2 }}
            />
            <TextField
              type="number"
              label="Hours Per Day"
              color="white"
              // InputProps={{ inputProps: { min: 1, max: 24 } }}
              value={hoursperday}
              onChange={(e) => setHoursPerDay(e.target.value)}
            />
          </Box>
      <div className="rem">
      {Object.entries(selectedSubjects).map(([subjectName, data], idx) => (
        <Box key={idx} sx={{ mb: 2, pl: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={data.checked}
                onChange={() => toggleSubject(subjectName)}
                sx={{color:"#7fff00"}}
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
                    sx={{color:"#7fff00"}}
                  />
                }
                label={sub.name}
              />
            ))}
          </Box>
        </Box>
      ))}
      </div>
      <div id="final"><Button variant="contained" color="primary" onClick={generatePlan} sx={{width:"20rem"}}><AutoAwesomeIcon sx={{margin:"0.5rem"}}/>Generate Study Plan using AI</Button></div>
      {/* <div className="gen"><Button variant="contained" color="primary" onClick={summarizeit} sx={{width:"20rem"}}>summarize</Button></div> */}
      </div>
      <div className="aisum">
        {summaryText && (
          <div className="summary-box">
            <h3>Motivational Summary</h3>
            <p>{summaryText}</p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default NewExam;
