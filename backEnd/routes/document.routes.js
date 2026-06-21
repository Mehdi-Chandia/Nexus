import express from 'express'
import {verifyToken} from "../middlewares/auth.js";
import {upload} from "../middlewares/multer.js";
import {getAllDocuments, getMeetingDocuments, uploadDocument} from "../controllers/document.controller.js";
const router = express.Router()

router.post("/upload/:meetingId",verifyToken,upload.single("file"),uploadDocument)
router.get("/get-docs/:meetingId",verifyToken,getMeetingDocuments)
router.get("/getAllDocs",verifyToken,getAllDocuments)

export default router;