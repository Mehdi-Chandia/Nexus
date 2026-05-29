import Chat from "../models/chat.model.js";


export async function getChat(req, res) {
    try {
        const {meetingId} = req.params;
        if (!meetingId) {
            return res.status(404).json({
                error: 'Id Not Found'
            });
        }

        const messages=await Chat.find({meetingId}).sort({createdAt: 1});
        if (!messages){
            return res.status(404).json({
                error: 'No messages found'
            })
        }
        return res.status(200).json({
            message:'Messages found',
            messages: messages,
        })
    }catch (err) {
        return res.status(500).send({
            message: err.message,
        })
    }
}