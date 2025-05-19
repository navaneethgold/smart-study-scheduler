const express=require("express")
const mongoose=require("mongoose")
require('dotenv').config();
const passportLocalMongoose=require("passport-local-mongoose");
const path=require("path");
const passport=require("passport");
const localStrategy=require("passport-local");
const session=require("express-session");
const app=express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const Task = require("./models/task");
const cors = require("cors");
const sessionOptions={
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,  
        maxAge:7*24*60*60*1000,
    },
    httpOnly:true,
};
app.use(cors({
  origin: "http://localhost:5173",  // your frontend URL
  credentials: true                // allow cookies/session
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
        if(req.isAuthenticated()){
            const tasks = await Task.find({username:req.user.username}).sort({ createdAt: 1 });
            res.json(tasks);
            console.log(tasks);
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



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
