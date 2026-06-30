import express from "express";
import {verifyToken} from "../middlewares/auth.js";
import {createPayment, getAllPayments, stripeWebhook} from "../controllers/payment.controller.js";
const router = express.Router();

router.post("/create/:id",verifyToken,createPayment)
router.post("/",stripeWebhook)
router.get("/getAll",verifyToken,getAllPayments)

export default router;