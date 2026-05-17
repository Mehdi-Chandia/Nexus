import fs from 'fs';
import {v2 as cloudinary} from 'cloudinary';
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})



export const uploadToCloudinary=async (filePath)=>{
    try {

        if(!filePath) return null;

        const response=await cloudinary.uploader.upload(filePath,{
            resource_type:"auto"
        })
        console.log("cloudinary response ",response)
        return response;
    }catch(err){
        console.log(err);
        fs.unlinkSync(filePath);
    }
}