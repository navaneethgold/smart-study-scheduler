const express = require("express");
const { CohereClient } = require("cohere-ai");

const router = express.Router();

const cohere = new CohereClient({
  token: 'y2USBIPOx0qdwX31nuY68DLlMHMBufLsUPaJAbBV',
});

const generateStudyPlan = async (selectedData, date, perday) => {
  const prompt = `You are a smart AI that creates efficient study plans.

The user can spend ${perday} hours a day studying. The exam is on ${date}.

The user selected the following topics:

${selectedData.map(sub => `Subject: ${sub.subject}\nChapters:\n${sub.subtopics.map(t => `- ${t}`).join('\n')}`).join('\n\n')}

Please generate a study plan as an array of JavaScript objects, one for each chapter. Each object should look like this:

{
  subject: "subject name",
  chapter: "chapter name",
  durationInMin: estimated time in minutes,
  approxpomo: estimated pomodoros,
  done: false
}

Ensure that total daily study time does not exceed ${perday} hours. Distribute chapters evenly and realistically until the exam date. Do NOT include 'username' or 'createdAt'.`;


  const response = await cohere.generate({
    model: 'command-r',
    prompt,
    max_tokens: 500,
    temperature: 0.7,
  });

  return response.body.generations[0].text.trim();
};

router.post("/generate-plan", async (req, res) => {
  const { topics, examDate, dailyHours } = req.body;
  const plan = await generateStudyPlan(topics, examDate, dailyHours);
  res.json({ plan });
});

module.exports = router; // ✅ CommonJS export
