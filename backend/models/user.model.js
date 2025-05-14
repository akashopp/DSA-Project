import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true
  },

  userId : {
    type: String,
    required : true
  },

  email : {
    type: String,
    required: true
  },

  phoneNumber : {
    type: Number,
    required: true
  },
  
  password : {
    
    type: String,
    required: true
    
  },

  problemId : {
    type : [String],
    required: true
  }

}, {timestamps : true});


export default mongoose.model('User', userSchema);