import Notification from "../models/notification.model.js";

export async function getNotifications(req, res) {
    try {
        console.log(req.user);
        const userId=req.user.id;

        const notifications = await Notification.find({userId:userId}).sort({createdAt:-1})
        if (!notifications) {
            return res.status(404).json({
                message: "Notifications not found.",
            })
        }
        console.log(notifications);
        const unreadCount=await Notification.countDocuments({
            userId:userId,
            isRead:false
        })

        return res.status(200).json({
            message:"Notifications found",
            unreadCount:unreadCount,
            notifications:notifications,
        })

    }catch(err) {
        console.log(err)
        res.status(500).json({
            message: err.message,
        })
    }
}

export async function markSingleAsRead(req,res){
    try {
        const {id}=req.params;
        const userId=req.user.id;

        const notification=await Notification.findById(id)
        if(!notification){
            return res.status(404).json({
                message:"Notification not found.",
            })
        }
        if(notification.userId.toString() !== userId.toString()){
            return res.status(401).json({
                message:"not authorized",
            })
        }

        notification.isRead=true
        notification.readAt=new Date();
        await notification.save()
        res.status(200).json({
            message:"Notification mark as read",
        })
    }catch(err) {
        res.status(500).json({
           error:err.message,
        })
    }
}

export async function markAllAsRead(req,res){
    try {
        const userId=req.user.id;

        await Notification.updateMany(
            { userId: userId, isRead: false },
            { isRead: true, readAt: new Date() }
        );

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read"
        });
    }catch(err) {
        res.status(500).json({
            error:err.message,
        })
    }
}