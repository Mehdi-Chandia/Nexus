import Meeting from "../models/meeting.model.js";
import {uploadToCloudinary} from "../config/cloudinary.js";
import Document from "../models/document.model.js";
import Notification from "../models/notification.model.js";


export async function uploadDocument(req, res) {
    try {
        const {meetingId}=req.params;
        const {documentType}=req.body;
        const userId=req.user.id;
        const file=req.file.path;
        if (!file){
            return res.status(400).send({error:"No file uploaded"});
        }

        const meeting=await Meeting.findById(meetingId)

        if(!meeting){
            return res.status(404).json({message:'no meeting found'});
        }

        const isParticipant = meeting.entrepreneurId.toString() === userId.toString() ||
            meeting.investorId.toString() === userId.toString();
        if (!isParticipant){
            return res.status(401).json({
                message:" not authorized for this meeting request",
            })
        }
        const cloudinaryResponse=await uploadToCloudinary(file)
        if(!cloudinaryResponse){
            return res.status(400).json({error:"error uploading file on cloudinary"});
        }

        const document=await Document.create({
            fileName:cloudinaryResponse.original_filename,
            fileUrl:cloudinaryResponse.secure_url,
            uploadedBy:userId,
            meetingId:meetingId,
            documentType:documentType,
            status:"uploaded",
            signatures: []
        })

        const otherUserId = meeting.entrepreneurId.toString() === userId.toString()
            ? meeting.investorId
            : meeting.entrepreneurId;

        const newNorification=await Notification.create({
            userId: otherUserId,
            type: "document_uploaded",
            title: "New Document Uploaded",
            message: `${req.user.username} uploaded "${cloudinaryResponse.original_filename}"`,
            relatedId: document._id,
            relatedModel: "Document",
            isRead: false
        })

        return res.status(201).json({
            success: true,
            message: "Document uploaded successfully",
            document: document
        });

    }catch(err) {
        return res.status(500).json({
            error: err.message
        })
    }
}

export async function getMeetingDocuments(req, res) {
    try {
        const {meetingId}=req.params;
        const userId=req.user.id;

        const meeting=await Meeting.findById(meetingId)

        if(!meeting){
            return res.status(404).json({message:"no meeting found"});
        }

        const isParticipant = meeting.entrepreneurId.toString() === userId.toString() ||
            meeting.investorId.toString() === userId.toString();

        if (!isParticipant){
            return res.status(401).json({
                message:" not authorized for this meeting request",
            })
        }

        const documents=await Document.find({meetingId:meetingId})
        if(!documents){
            return res.status(404).json({message:"no documents found for this meeting"});
        }
        const documentsWithStatus=documents.map(doc=>{
            const userHasSigned=doc.signatures.some(sig=>{
                sig.userId.toString() === userId.toString();
            })
            return{
                ...doc._doc,
                needMySignatures:!userHasSigned
            }
        })
        res.json({ documents: documentsWithStatus });
    }catch(err) {
        return res.status(500).json({
            error: err.message
        })
    }
}

export async function getAllDocuments(req, res) {
    try {
        const userId=req.user.id;

        const myMeetings=await Meeting.find({
            $or:[
                { entrepreneurId: userId },
                { investorId: userId }
            ]
        })
        if(!myMeetings){
            return res.status(404).json({message:"no meeting found for this user"});
        }
        const meetingIds=myMeetings.map(meeting=> meeting._id)

        const myDocuments=await Document.find({
            meetingId:{$in: meetingIds},
        })
        if(!myDocuments){
            return res.status(404).json({message:"no documents found for this meeting request"});
        }

        const documentsWithInfo=myDocuments.map(doc=>{
            const meeting=myMeetings.find(m=> m._id.toString() === doc.meetingId.toString())

            const otherPerson = meeting.entrepreneurId.toString() === userId
                ? meeting.investorId
                : meeting.entrepreneurId;

            const userHasSigned = doc.signatures.some(
                sig => sig.userId.toString() === userId.toString()
            );

            return {
                id: doc._id,
                filename: doc.filename,
                meetingWith: otherPerson.username,
                meetingDate: meeting.startTime,
                uploadedBy: doc.uploadedBy.username,
                needsMySignature: !userHasSigned,
                status: doc.status,
                fileUrl: doc.fileUrl
            };
        })
        res.json({ documents: documentsWithInfo });
    }catch(err) {
        return res.status(500).json({
            error: err.message
        })
    }
}