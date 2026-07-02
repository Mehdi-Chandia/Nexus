import User from "../models/user.model.js";
import crypto from "crypto";
import {sendResetPasswordEmail} from "../services/email.service.js";
import bcrypt from "bcrypt";



export async function forgotPassword(req,res){
    try {
        const {email}= req.body;
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({
                message:
                    "If an account exists, reset link has been sent"
            })
        }

        const resetToken= crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires=Date.now() + 10 * 60 * 1000;

        await user.save()

        const resetLink=`${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        await sendResetPasswordEmail(email,resetLink);

        return res.status(200).json({
            message:
                "If an account exists, reset link has been sent"
        })

    }catch(err){
        return res.status(500).send({
            message:err.message,
        })
    }
}

export async function resetPassword(req,res){
    try {
        const {token}=req.params;
        const {password,confirmPassword} = req.body;

        if (!password || !confirmPassword || password.length<6 || confirmPassword.length<6){
            return res.status(400).send({
                message:"Password must be at least 6 characters"
            })
        }
        if (password !== confirmPassword){
            return res.status(400).send({
                message:"Password does not match"
            })
        }

        const user=await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        })
        if(!user){
            return res.status(400).send({
                message:"invalid or expired token"
            })
        }

        const hashPassword=await bcrypt.hash(password,10)

        user.password=hashPassword

        user.resetPasswordToken=null;
        user.resetPasswordExpires=null;

        await user.save();

        return res.status(200).json({
            message:"Password reset successfully",
        })
    }catch(err){
        return res.status(500).send({
            message:err.message,
        })
    }
}