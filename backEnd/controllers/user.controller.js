import {
    entrepreneurProfileSchema,
    investorProfileSchema,
    loginSchema,
    signupSchema
} from "../validation/auth.validation.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import tokenBlackList from "../models/token.model.js";
import {uploadToCloudinary} from "../config/cloudinary.js";
import {sendOTPEmail} from "../services/email.service.js";


export async function SignUp(req, res) {
    try {

        const {error}=signupSchema.validate(req.body,{abortEarly: false});

        if(error){
            return res.status(400).json({
                message: error.details[0].message
            })
        }
        const { username, email, password,role } = req.body;

        const user=await User.findOne({email})
        if(user){
           return res.status(400).json({
               message:'Email already exists',
           })
        }

        const hashPassword=await bcrypt.hash(password,10);

        const newUser=await User.create({
            username,
            email,
            password:hashPassword,
            role
        })

        const token=jwt.sign({
            id:newUser._id,
            username:newUser.username,
            email:newUser.email,
            role:newUser.role
        },process.env.JWT_SECRET,{expiresIn:'1d'})

        res.cookie('token',token,{
            httpOnly:true,
            secure:false
        })

        return res.status(201).json({
            message:"user SignUp successfully",
            user:{
                username,
                email,
                role
            }
        })

    }catch(err) {
        console.log(err);
        return res.status(500).json({
            message: "internal server error"
        })
    }
}

export async function completeProfile(req, res) {
    try {

        console.log(req.user);
        const role=req.user.role;
        const userId=req.user.id;
        let user;
        const profilePicturepath=req.file.path;
        let profilePictureData={};
        if (profilePicturepath){
            const uploadedImage=await uploadToCloudinary(profilePicturepath);
            if(uploadedImage){
                profilePictureData={
                    fileUrl: uploadedImage.secure_url,
                    fileName: uploadedImage.original_filename
                }
            }
        }

        if (role === 'entrepreneur'){
            const {error}=entrepreneurProfileSchema.validate(req.body,{abortEarly: false});
            if(error){
                return res.status(400).json({
                    message: error.details[0].message
                })
            }
            const {
                companyName,
                bio,
                location,
                industry,
                fundingNeeded
            } = req.body;

            user=await User.findByIdAndUpdate(userId,{
                companyName,
                bio,
                location,
                industry,
                fundingNeeded,
                profilePicture:profilePictureData,
                isProfileCompleted:true
            },{new:true})

        }else if (role === 'investor'){
            const {error}=investorProfileSchema.validate(req.body,{abortEarly: false});
            if(error){
                return res.status(400).json({
                    message: error.details[0].message
                })
            }

            const {
                companyName,
                bio,
                location,
                industryInterested,
                investmentMin,
                investmentMax
            } = req.body;

            user = await User.findByIdAndUpdate(
                userId,
                {
                    companyName,
                    bio,
                    location,
                    industryInterested,
                    profilePicture:profilePictureData,
                    investmentMin,
                    investmentMax,
                    isProfileCompleted:true
                },
                { new:true }
            )
        }else {

            return res.status(400).json({
                message:"Invalid role"
            })
        }

        return res.status(200).json({
            message:"Profile completed successfully",
            user
        })

    }catch(err) {
        return res.status(500).json({
            message: "internal server error"
        })
    }
}

export async function Login(req, res) {
    try {
        const {error}=loginSchema.validate(req.body,{abortEarly: false});

        if(error){
            return res.status(400).json({
                message: error.details[0].message
            })
        }

        const {email, password} = req.body;

        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({
                message:'invalid email or password',
            })
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(401).json({
                message:'invalid email or password',
            })
        }

        const otp = Math.floor(100000 + Math.random() * 900000)
                .toString();
        user.twoFactorCode=otp;

        user.twoFactorExpires =
            Date.now() + 5 * 60 * 1000;
        await user.save();

        await sendOTPEmail(
            user.email,
            otp
        )

        return res.status(200).json({

            message:"OTP sent successfully",

            requires2FA:true,

            email:user.email
        })

        // const token=jwt.sign({
        //     id:user._id,
        //     username:user.username,
        //     email:user.email,
        //     role:user.role
        // },process.env.JWT_SECRET,{expiresIn:'1d'})
        //
        // res.cookie('token',token,{
        //     httpOnly:true,
        //     secure:false
        // })

        // return res.status(200).json({
        //     message:"user logged in successfully",
        //     user:{
        //         id:user._id,
        //     }
        // })


    }catch(err) {
        console.log(err.message)
        return res.status(500).json({
            message: "internal server error"
        })
    }
}

export async function verifyOTP(req, res) {
    try {
        const {email,otpCode}=req.body;

        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({
                message:'invalid email',
            })
        }
        if (user.twoFactorCode !== otpCode){
            return res.status(401).json({
                message:"invalid OTP code",
            })
        }
        if (user.twoFactorExpires < Date.now()){
            return res.status(401).json({
                message:"OTP expired",
            })
        }
        user.twoFactorCode = null;
        user.twoFactorExpires = null;
        user.isEmailVerified=true;

        await user.save();

        const token = jwt.sign({
                id:user._id,
                username:user.username,
                email:user.email,
                role:user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"1d"
            })

        res.cookie("token",token,{
            httpOnly:true,
            secure:false,
            sameSite:"strict"
        })

        return res.status(200).json({
            success:true,
            message:"Login successful",
            user:{
                id:user._id,
                username:user.username,
                email:user.email,
                role:user.role
            }
        })
    }catch(err) {
        return res.status(500).json({
            message:err.message
        })
    }
}

export async function resendOTP(req, res) {
    try {
        const {email}=req.body;
        if(!email){
            return res.status(400).json({
                message:'email is required',
            })
        }

        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({
                message:'invalid email',
            })
        }
        const otp=Math.floor(100000 + Math.random() * 900000).toString();
        user.twoFactorCode = otp;

        user.twoFactorExpires =
            Date.now() + 5 * 60 * 1000;
        await user.save();

       await sendOTPEmail(email,otp)
        return res.status(200).json({
            success:true,
            message:"OTP Resend successfully",
        })

    }catch(err) {
        return res.status(500).json({
            message:err.message
        })
    }
}

export async function Logout(req, res) {
    try {
        const token=req.cookies.token;
        if(token){
            const blackListToken=await tokenBlackList.create({token})
        }
        res.clearCookie('token');

        return res.status(200).json({
            message:"user logged out successfully",
        })
    }catch(err) {
        return res.status(500).json({
            message: "internal server error"
        })
    }
}

export async function getUser(req, res) {
   try {
       console.log(req.user)

   const user=await User.findById({_id:req.user.id}).select('-password')
       if(!user){
           return res.status(404).json({
               message:"user not found",
           })
       }

       return res.status(200).json({
           message:"user found",
           user:user
       })
  }catch(err) {

    return res.status(500).json({
        message: "internal server error",
        error:err
    })
}
}

export async function getAllUsers(req, res) {
    try {
        const users=await User.find().select('-password')
        if(!users){
            return res.status(404).json({
                message:"user not found",
            })
        }
        return res.status(200).json({
            message:"users found",
            users:users
        })
    }catch(err) {
        return res.status(500).json({
            message:err.message
        })
    }
}