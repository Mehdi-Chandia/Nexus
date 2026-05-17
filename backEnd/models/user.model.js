import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum:['entrepreneur','investor'],
        required:true
    },
    //2FA fields
    isEmailVerified:{
        type:Boolean,
        default:false
    },

    twoFactorCode:{
        type:String
    },

    twoFactorExpires:{
        type:Date
    },
    //
    //reset password fields
    resetPasswordToken:{
        type:String
    },
    resetPasswordExpires:{
        type:Date
    },
    //
    companyName:{
        type: String,

    },
    bio:{
        type: String,
    },
    location:{
        type: String,
    },
    isProfileCompleted:{
        type: Boolean,
            default: false
    },
    profilePicture:{
        fileUrl:String,
        fileName:String
    },
    //entrepreneur specific fields
    industry:{
        type: String,

    },
    fundingNeeded:{
        type: Number,
    },
    //investor specific fields
    industryInterested:{
        type:String,
    },
    investmentMin:{
        type:Number,
    },
    investmentMax:{
        type:Number,
    }

},{timestamps: true});

const User = mongoose.model('User', UserSchema);
export default User;