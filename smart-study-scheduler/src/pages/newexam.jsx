import React, { useEffect, useState } from "react";
import axios from "axios";
import { Checkbox, FormControlLabel, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NewExam = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState({});
  const navigate = useNavigate();
  const [isLogged,setIsLogged]=useState(null);
  const [userData,setUserdata]=useState({});
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

  const date = "June 4th 2025";
  const perday = "10 hours";
  // console.log(selectedData);
  try {
    // Step 1: Send selected topics to backend for AI generation
    const response = await axios.post(
      "http://localhost:5000/generate-plan",
      { selectedData, date, perday },
      { withCredentials: true }
    );
    
    const data = response.data;
    // console.log(data.plan);
    // console.log(typeof data.plan,data.plan);
    let generatedTasks = data.plan; // assuming backend returns { tasks: [...] }
    // for(let i=0;i<generatedTasks.length;i++){
    //     const task=generatedTasks[i];
    //     await axios.post("http://localhost:5000/add", task, { withCredentials: true });
    // }
    // generatedTasks = Array.isArray(data.plan) ? data.plan : [data.plan];
    console.log("ide na:",generatedTasks);
    // const taskPromises = generatedTasks.map(task =>{
      // let taskData = {
      //   ...task,
      //   username:userData.username,
      //   durationInMin: Number(task.durationInMin),
      //   approxpomo: Number(task.approxpomo)
      // };
      // console.log("taskdata: ",taskData);
      // console.log("taks nanna: ",task);
      await axios.post("http://localhost:5000/add", generatedTasks, { headers: {
    "Content-Type": "application/json"
  },withCredentials: true });
  // });

    // await Promise.all(taskPromises);
    alert("Study plan generated and saved successfully!");

  } catch (error) {
    console.error("Error generating or saving study plan:", error);
    alert("Something went wrong while generating or saving the study plan.");
  }
};


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
      <Button variant="contained" color="primary" onClick={generatePlan}>Generate Study Plan</Button>
    </Box>
  );
};

export default NewExam;
