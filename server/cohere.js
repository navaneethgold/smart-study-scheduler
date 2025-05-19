// routes/studyplan.js
import express from 'express';
import { generateStudyPlan } from './openai.js';

const airouter = express();

airouter.post('/generate-plan', async (req, res) => {
  const { topics, examDate, dailyHours } = req.body;
  const plan = await generateStudyPlan(topics, examDate, dailyHours);
  res.json({ plan });
});

export default airouter;
