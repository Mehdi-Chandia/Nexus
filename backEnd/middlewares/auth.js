import jwt from "jsonwebtoken";
import tokenBlackList from "../models/token.model.js";

export const verifyToken=async (req,res,next)=>{
    try {
        const token=req.cookies.token;

        if(!token){
            return res.status(404).json({
                message:"Token not found",
            })
        }
        const blackListed=await tokenBlackList.findOne({token:token});
        if(blackListed){
           return res.status(400).json({
               message:"invalid token",
           })
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;

        next()
    }catch(err){
        console.log(err);
        return res.status(401).json({
            message:"unauthorized user",
        })
    }
}