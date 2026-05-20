import express from "express";
import {
    completeProfile,
    getAllUsers,
    getUser,
    Login,
    Logout,
    resendOTP,
    SignUp,
    verifyOTP
} from "../controllers/user.controller.js";
import {verifyToken} from "../middlewares/auth.js";
import {upload} from "../middlewares/multer.js";
import {forgotPassword, resetPassword} from "../controllers/resetPassword.controller.js";
const router = express.Router();

router.post("/register",SignUp)
router.post("/login",Login)
router.post("/verify-otp",verifyOTP)
router.post("/resend-otp",resendOTP)
router.get("/logout",Logout)
router.get("/get-all-users",getAllUsers)
router.get("/get-me",verifyToken,getUser)
router.post("/forgot-password",forgotPassword)
router.post("/reset-password/:token",resetPassword)
router.post("/complete-profile",verifyToken,upload.single("profilePicture"),completeProfile)

export default router;