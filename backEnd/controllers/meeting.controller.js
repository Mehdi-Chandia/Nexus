import mongoose from "mongoose";
import Meeting from "../models/meeting.model.js";
import {meetingSchema} from "../validation/auth.validation.js";
import Notification from "../models/notification.model.js";

export async function createMeeting(req, res) {
    try {
        const {id}=req.params;
        const loggedUser=req.user;
        console.log(req.body);
        const {agenda,startTime,endTime} = req.body;

        const {error}=meetingSchema.validate(req.body,{abortEarly: false});
        if (error){
            return res.status(400).json({
                message: error.details[0].message
            })
        }

        let entrepreneurId, investorId;
        if (loggedUser.role === 'investor'){
            entrepreneurId=id;
            investorId=loggedUser.id;
        }else if(loggedUser.role === 'entrepreneur'){
            entrepreneurId=loggedUser.id;
            investorId=id;
        }else {
            return res.status(400).json({error:'invalid logged user'});
        }
        const existingMeeting=await Meeting.findOne({
            $or:[
                { entrepreneurId: entrepreneurId, investorId: investorId },
                { entrepreneurId: investorId, investorId: entrepreneurId }
            ],
            startTime:startTime,
            status:{$in: ["pending", "accepted"]}
        })
        if(existingMeeting){
            return res.status(400).json({
                message:"meeting already exists at this time"
            });
        }
        const newMeeting = await Meeting.create({
            entrepreneurId: entrepreneurId,
            investorId: investorId,
            startTime: startTime,
            endTime: endTime,
            agenda: agenda,
            status: "pending"
        })

        const newNotification=await Notification.create({
            userId:id,
            type:"meeting_request",
            message:`${loggedUser.username} requested a meeting`,
            relatedId:newMeeting._id,
            relatedModel:'Meeting',
            isRead:false
        })

        return res.status(201).json({
            success: true,
            message: "Meeting request sent successfully",
            meeting: newMeeting
        });

    }catch(err) {
        console.log(err);
        return res.status(400).json({
            message:"internal server error",
        })
    }
}

export async function acceptMeeting(req, res) {
    try {
        const {meetingId}=req.params;
        // console.log("meeting id received in params ",meetingId);
        const userId=req.user.id;
        const meeting=await Meeting.findById(meetingId)
        if(!meeting){
            return res.status(404).json({
                message:"meeting not found",
            })
        }
        if (meeting.investorId.toString() !== userId.toString()){
            return res.status(400).json({
                message:"only investor can accept this meeting",
            })
        }
        if (meeting.status !== "pending"){
            return res.status(400).json({
                message:"meeting already accepted",
            })
        }

        meeting.status = "accepted";
        await meeting.save();

        await Notification.create({
            userId: meeting.entrepreneurId,
            type: "meeting_accepted",
            title: "Meeting Accepted",
            message: `${req.user.username} accepted your meeting request`,
            relatedId: meeting._id,
            relatedModel: "Meeting",
            isRead: false
        });

        return res.status(200).json({
            success: true,
            message: "Meeting accepted successfully",
            meeting: meeting
        });

    }catch (error) {
        console.log(error);
        return res.status(400).json({
            message:'internal server error',
        })
    }
}

export async function rejectMeeting(req, res) {
    try {
        const { meetingId } = req.params;
        const userId = req.user.id;
        const { reason } = req.body;

        const meeting = await Meeting.findById(meetingId);

        if (!meeting) {
            return res.status(404).json({ message: "Meeting not found" });
        }

        if (meeting.investorId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Only investor can reject this meeting" });
        }

        if (meeting.status !== "pending") {
            return res.status(400).json({ message: "Meeting already accepted or rejected" });
        }

        meeting.status = "rejected";
        await meeting.save();

        await Notification.create({
            userId: meeting.entrepreneurId,
            type: "meeting_rejected",
            title: "Meeting Rejected",
            message: `${req.user.name} rejected your meeting request${reason ? `: ${reason}` : ''}`,
            relatedId: meeting._id,
            relatedModel: "Meeting",
            isRead: false
        });

        return res.status(200).json({
            success: true,
            message: "Meeting rejected",
            meeting: meeting
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export async function getSingleMeeting(req,res){
    try {
        const {meetingId} = req.params;
        const userId=req.user.id;

        const meeting=await Meeting.findById(meetingId);
        if (!meeting){
            return res.status(404).json({
                message:"Meeting not found"
            })
        }

        const isParticipant = meeting.entrepreneurId.toString() === userId.toString() ||
            meeting.investorId.toString() === userId.toString();

        if (!isParticipant){
            return res.status(401).json({
                message:" not authorized for this meeting request",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Meeting found successfully",
            meeting: meeting
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:"internal server error"
        })
    }
}

export async function getAllMeetings(req,res){
    try {
        const userId=req.user.id;
        console.log('logged in user id',userId)
        const meetings=await Meeting.find({
            $or:[
                { entrepreneurId: userId },
                { investorId: userId }
            ]
        }).sort({startTime: 1})
        if (!meetings){
            return res.status(404).json({
                message:"No meetings found with given user"
            })
        }

        return res.status(200).json({
            success: true,
            meetings: meetings
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}