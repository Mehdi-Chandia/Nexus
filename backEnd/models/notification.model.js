import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message: {
        type: String,
        required: true,
    },
    isRead:{
        type: Boolean,
        default: false
    },
    relatedId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meeting'
    },
    relatedModel:{
        type: String,
        required: true,
    },
    readAt:{
        type: Date,
    }
},{timestamps: true});

const Notification = mongoose.model('Notification', NotificationSchema);
export default Notification;