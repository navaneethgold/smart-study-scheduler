const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  subject: {type:String,required:true},
  chapter: {type:String,required:true},
  durationInMin: {type:Number,required:true},
  approxpomo: {type:Number,required:true},
  done: {type:Boolean,required:false,default:false},
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Task", taskSchema);
