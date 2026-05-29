import mongoose from "mongoose";

const chatSchema =new mongoose.Schema({
    meetingId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Meeting",
        required:true
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    text:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
    }
})

const Chat=mongoose.model("Chat",chatSchema);
export default Chat;