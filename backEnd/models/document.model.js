import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    meetingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Meeting",
        required: true
    },
    documentType: {
        type: String,
        enum: ["pitch_deck", "business_plan", "term_sheet", "nda", "other"],
        default: "other"
    },
    status: {
        type: String,
        enum: ["uploaded", "partially_signed", "fully_signed"],
        default: "uploaded"
    },
    signatures: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            signatureUrl: String,
            signedAt: Date
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Document = mongoose.model("Document", documentSchema);
export default Document;