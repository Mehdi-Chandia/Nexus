import express from "express";
import {verifyToken} from "../middlewares/auth.js";
import {getChat} from "../controllers/chat.controller.js";
const router = express.Router();

router.get("/messages/:meetingId",verifyToken,getChat)

export default router;