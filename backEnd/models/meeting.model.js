import mongoose from 'mongoose';

const meetingSchema =new mongoose.Schema({
    entrepreneurId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    investorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    agenda:{
      type:String,
      required:true
    },
    startTime:{
        type:Date,
        required:true
    },
    endTime:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        enum:["pending", "accepted", "rejected", "completed"],
        default:"pending",
    },

},{timestamps:true});

const Meeting = mongoose.model("Meeting", meetingSchema);
export default Meeting;