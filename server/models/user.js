const mongoose=require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose");
const userSchema=new mongoose.Schema({
    username:{type:String, required:true},
    studying:{type:String, required:true},
    subjects: [
    {
      subjectName: { type: String, required: true },
      subtopics: [{ type: String, required: true }]
    }
  ]
});
userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("user",userSchema);