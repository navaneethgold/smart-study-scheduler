const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  username:{type:String,required:true},
  subject: {type:String,required:true},
  chapter: {type:String,required:true},
  durationInMin: {type:Number,required:true},
  approxpomo: {type:Number,required:true},
  done: {type:Boolean,required:false,default:false},
  createdAt: {
    type: Date,
    default: Date.now,
  },
  endTime:{type:Date, required:false,default:null}
});

module.exports = mongoose.model("Task", taskSchema);
