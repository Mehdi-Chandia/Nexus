import mongoose from "mongoose";


const tokenBlackListSchema = new mongoose.Schema({
    token:{
        type:String,
        required:[true,'Token is required']
    }
},{ timestamps:true })

const tokenBlackList= mongoose.model("tokens",tokenBlackListSchema)
export default tokenBlackList;