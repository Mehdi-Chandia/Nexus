import express from "express";
import {getNotifications, markAllAsRead, markSingleAsRead} from "../controllers/notification.controller.js";
import {verifyToken} from "../middlewares/auth.js";
const router = express.Router();

router.get("/getAllNotifications",verifyToken,getNotifications)
router.put("/:id/read",verifyToken,markSingleAsRead)
router.put("/read-all",verifyToken,markAllAsRead)

export default router;