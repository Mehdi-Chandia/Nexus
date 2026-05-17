import express from "express";
import {verifyToken} from "../middlewares/auth.js";
import {
    acceptMeeting,
    createMeeting,
    getAllMeetings,
    getSingleMeeting,
    rejectMeeting
} from "../controllers/meeting.controller.js";
const router = express.Router();

router.post("/request-meeting/:id",verifyToken,createMeeting)
router.get("/accept/:meetingId",verifyToken,acceptMeeting)
router.post("/reject/:meetingId",verifyToken,rejectMeeting)
router.get("/single-meeting/:meetingId",verifyToken,getSingleMeeting)
router.get("/all-meetings",verifyToken,getAllMeetings)

export default router;