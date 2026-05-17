import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {connectToDb} from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import meetingRoutes from "./routes/meeting.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import documentRoutes from "./routes/document.routes.js";
import cookieParser from "cookie-parser";
import {sendOTPEmail} from "./services/email.service.js";

dotenv.config();

const app = express()
const port = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}))

connectToDb()


//routes
app.use("/api/auth",userRoutes);
app.use("/api/meeting",meetingRoutes);
app.use("/api/notification",notificationRoutes);
app.use("/api/document",documentRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get("/test-email", async(req,res)=>{

    const response =
        await sendOTPEmail(
            "mehdichandia76@gmail.com",
            "483920"
        );

    res.json(response);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
