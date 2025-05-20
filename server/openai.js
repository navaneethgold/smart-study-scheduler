const express = require("express");
const { CohereClient } = require("cohere-ai");

const router = express.Router();

const cohere = new CohereClient({
  token: 'y2USBIPOx0qdwX31nuY68DLlMHMBufLsUPaJAbBV',
});

const generateStudyPlan = async (selectedData, date, perday) => {
  console.log(date);
  const prompt = `You are a smart AI that creates efficient and realistic study plans for students.

The user has an exam on ${date} and is able to study ${perday} hours each day.

The user has selected the following topics to prepare:

${selectedData.map(sub => `Subject: ${sub.subject}\nChapters:\n${sub.subtopics.map(t => `- ${t}`).join('\n')}`).join('\n\n')}

Your task is to generate a study plan **as a valid JavaScript array of plain objects** — one object for each chapter — like this:

{
  subject: "subject name",
  chapter: "chapter name",
  durationInMin: estimated time in minutes,
  approxpomo: estimated pomodoros,
  done: false
}

Output **only** the array (do NOT write any code, explanation, or extra text). No variables like 'let', 'const', or console logs. No comments. No markdown.

Just return a raw JSON-compatible array of objects that I can directly insert into MongoDB.

Rules:
- Total study time per day must not exceed ${perday} hours (i.e., ${perday * 60} minutes).
- Distribute the study load evenly and realistically over the available days.
- Duration and pomodoros should be practical for each topic.
- Do NOT include any extra fields like 'username', 'createdAt', or 'id'.

Remember: return ONLY a clean array of task objects.`;


  const response = await cohere.chat({
    model: 'command-r',
    message:prompt,
    // max_tokens: 500,
    temperature: 0.7,
  });

  return response.text.trim();
};

router.post("/generate-plan", async (req, res) => {
  const { selectedData, date, perday } = req.body;
  const plan = await generateStudyPlan(selectedData, date, perday);
  // console.log(plan);
  res.json({ plan });
});

module.exports = router; // ✅ CommonJS export
