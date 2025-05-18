const express=require("express")
const mongoose=require("mongoose")
require('dotenv').config();
const app=express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const Task = require("./models/task");
const cors = require("cors");
const task = require("./models/task");
app.use(cors());
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

app.post("/add",async(req,res)=>{
    try{
        const task=new Task(req.body);
        await task.save();
        res.status(201).json({ success: true, task });
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(400).json({ success: false, error: error.message });
    }
});

app.get("/tasks",async(req,res)=>{
    try {
        const tasks = await Task.find().sort({ createdAt: 1 });
        res.json(tasks);
    } catch (error) {
        console.log("error acquiring tasks:",error);
        res.status(500).json({ success: false, error: error.message });
    }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
