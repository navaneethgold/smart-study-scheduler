const express=require("express")
const mongoose=require("mongoose")
require('dotenv').config();
const passportLocalMongoose=require("passport-local-mongoose");
const path=require("path");
const passport=require("passport");
const localStrategy=require("passport-local");
// import studyPlanRouter from './cohere.js';
// const airouter=require("./cohere.js");
// const generateStudyPlan=require("./openai");
const session=require("express-session");
const app=express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const Task = require("./models/task");
const cors = require("cors");
app.set("trust proxy", 1);
const sessionOptions = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "none",
    secure: true, // safer for local testing
    domain: "smart-study-scheduler.onrender.com", // ✅ backend domain
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};
const allowedOrigins = [
  "http://localhost:5173",             // dev
  "https://smart-study-scheduler-front.onrender.com",   // production
  "https://smart-study-scheduler-taupe.vercel.app/"
];

app.use(cors({
  origin: (origin, callback) => {
    console.log("CORS request from:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
const task = require("./models/task");
const user=require("./models/user");
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
const dburl=process.env.MONGO_URI;
main().then(()=>{
    console.log("connected-successfully");
}).catch((error)=>{
    console.log("not connected");
    console.log(error)
})
async function main(){
    await mongoose.connect(dburl);
}

const generateStudyPlanRouter = require("./openai"); // ✅ CommonJS import
// const task = require("./models/task");

app.use("/", generateStudyPlanRouter); // ✅ Now works properly



app.post("/add", async (req, res) => {
  try {
    console.log(req.body);
    let tasks=req.body;
    console.log(tasks);
    const savedTasks = [];
    for (const task of tasks) {
      const { subject, chapter, durationInMin } = task;

      const taskData = {
        username: req.user.username, // assuming user is attached via middleware
        subject,
        chapter,
        durationInMin,
        approxpomo:Math.ceil(durationInMin/30),
      };

      const newTask = new Task(taskData);
      const saved = await newTask.save();
      savedTasks.push(saved);
    }

    res.status(201).json({ success: true, tasks: savedTasks });
  } catch (error) {
    console.error("Error creating tasks:", error);
    res.status(400).json({ success: false, error: error.message });
  }
});


app.get("/tasks",async(req,res)=>{
    try {
        if(req.isAuthenticated()){
            const tasks = await Task.find({username:req.user.username}).sort({ createdAt: 1 });
            res.json(tasks);
            // console.log(tasks);
        }else{
            res.status(401).json({ success: false, message: "Not authenticated" });
        }
        // console.log(req.user.username);
        
    } catch (error) {
        console.log("error acquiring tasks:",error);
        res.status(500).json({ success: false, error: error.message });
    }
})

app.post("/signup",async(req,res)=>{
    let {username,password,studying,subjects}=req.body;
    const usern=await user.findOne({username:username});
    let new_user="";
    if(usern){
        return res.status(400).send("username already exists");
    }else{
        new_user=new user({username:username,studying:studying,subjects:subjects});
    }
    const registered_user=await user.register(new_user,password);
    req.logIn(registered_user,(err)=>{
        if(err){
            return next(err);
        }
        res.json(new_user);
    });
})

app.post("/login",passport.authenticate("local",{failureRedirect:"/login"}),async(req,res)=>{
    try{
        if(req.isAuthenticated()){
            res.json(req.user);
        }
    }catch (error) {
        console.log("error logging in:",error);
        res.status(500).json({ success: false, error: error.message });
    }
})
app.get("/check-auth",async(req,res)=>{
    if (req.isAuthenticated()) {
        res.json({ isAuthenticated: true, user: req.user });
    } else {
        res.json({ isAuthenticated: false });
    }
})

app.get("/user/subjects", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not logged in" });
  }
  res.json(req.user.subjects);
});


app.post('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.clearCookie("connect.sid"); // Optional: clear session cookie
    res.json({ message: "Logged out" });
  });
});

app.put("/:id/pomo-complete", async (req, res) => {
  try {
    const { id } = req.params;
    let currtask = await task.findById(id);
    if (!currtask) {
      return res.status(404).json({ message: "Task not found" });
    }

    currtask.approxpomo -= 1;
    currtask.durationInMin -= 30;
    await currtask.save();

    if (currtask.approxpomo === 0) {
      currtask.done=true;
      await currtask.save();
    } else {
      return res.status(200).json({ message: "Pomodoro completed", task: currtask });
    }
  } catch (error) {
    console.error("Error marking pomodoro complete:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/:id/delete", async (req, res) => {
  try {
    const { id } = req.params;
    const currtask = await task.findById(id);
    if (!currtask) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.deleteOne({ _id: id });
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Server error" });
  }
});


app.put("/:id/complete", async (req, res) => {
  try {
    const { id } = req.params;
    const currtask = await task.findById(id);
    if (!currtask) {
      return res.status(404).json({ message: "Task not found" });
    }
    currtask.done=true;
    await currtask.save();
    return res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Server error" });
  }
});


app.put("/:id/setEnd", async (req, res) => {
  try {
    const { id } = req.params;

    const currtask = await task.findById(id);

    if (!currtask) {
      return res.status(404).json({ message: "Task not found" });
    }
    const already=await task.find({username:currtask.username,endTime:null});
    const findall=await task.find({username:currtask.username});
    if(already.length!=findall.length){
      return res.status(403).json({ message: "Another Pomodoro is already running." });
    }
    currtask.endTime = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now
    await currtask.save();

    res.status(200).json({ message: "Timer updated", endTime: currtask.endTime });
  } catch (error) {
    console.error("Error setting endTime:", error);
    res.status(500).json({ message: "Server error" });
  }
});


app.put("/:id/clearEnd", async (req, res) => {
  try {
    const { id } = req.params;

    const currtask = await task.findById(id);
    if (!currtask) {
      return res.status(404).json({ message: "Task not found" });
    }

    currtask.endTime = null; // 30 minutes from now
    await currtask.save();

    res.status(200).json({ message: "Timer updated", endTime: currtask.endTime });
  } catch (error) {
    console.error("Error setting endTime:", error);
    res.status(500).json({ message: "Server error" });
  }
});


app.delete("/:username/:index/delete", async (req, res) => {
  const { username, index } = req.params;

  try {
    const curruser = await user.findOne({ username: username });
    if (!curruser) return res.status(404).json({ error: "User not found" });

    const subjectToDelete = curruser.subjects[index];
    if (!subjectToDelete) return res.status(404).json({ error: "Subject not found" });

    await task.deleteMany({ subject: subjectToDelete.subjectName });

    curruser.subjects.splice(index, 1);
    await curruser.save();

    res.status(200).json({ message: "Subject and related tasks deleted successfully" });
  } catch (err) {
    console.error("Error deleting subject:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/:username/update-subjects", async (req, res) => {
  const { username } = req.params;
  const {subjects} = req.body;
  console.log(subjects);
  try {
    const currUser = await user.findOne({ username });

    if (!currUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!Array.isArray(subjects)) {
      return res.status(400).json({ error: "Invalid subjects data" });
    }

    currUser.subjects = subjects;
    await currUser.save();

    res.status(200).json({ message: "Subjects updated successfully" });
  } catch (err) {
    console.error("Error updating subjects:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/ping", (req, res) => {
  res.send("Backend is alive!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
