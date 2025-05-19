// server/routes/ai.js
const express = require("express");
const router = express.Router();
// const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
// const openai = new OpenAIApi(configuration);

router.post("/generate-plan", async (req, res) => {
  try {
    const { selectedData, date, perday } = req.body;
    console.log("topicss: ",date);
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

Ensure that total daily study time does not exceed ${perday} hours. Distribute chapters evenly and realistically until the exam date. Do NOT include 'username' or 'createdAt'.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const result = response.data.choices[0].message.content;
    const tasks = JSON.parse(result); // If not safe, wrap with try-catch
    res.json({ success: true, tasks });

  } catch (error) {
    console.error("AI generation failed:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
