import mongoose from "mongoose";

const paymentSchema=new mongoose.Schema({

    investorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    entrepreneurId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    meetingId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Meeting",
        required:true
    },

    amount:{
        type:Number,
        required:true
    },

    stripeSessionId:{
        type:String
    },

    paymentStatus:{
        type:String,
        enum:["pending","success","failed"],
        default:"pending"
    }

},{
    timestamps:true
});

const Payment=mongoose.model(
    "Payment",
    paymentSchema
);

export default Payment;