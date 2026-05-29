import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import {Server} from 'socket.io'
import cors from 'cors';
import {connectToDb} from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import meetingRoutes from "./routes/meeting.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import documentRoutes from "./routes/document.routes.js";
import cookieParser from "cookie-parser";
import {sendOTPEmail} from "./services/email.service.js";
import Chat from "./models/chat.model.js";

dotenv.config();

const app = express()
const port = 3000
const server= http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const io=new Server(server,{
    cors:{
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }
})

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}))

connectToDb()


//routes

// auth routes
app.use("/api/auth",userRoutes);
// meeting routes
app.use("/api/meeting",meetingRoutes);
// notif routes
app.use("/api/notification",notificationRoutes);
// document routes
app.use("/api/document",documentRoutes);
// chat route
app.use("/api/chat",chatRoutes);

let onlineUsers={}

io.on("connection", (socket) => {
    console.log("user connected :", socket.id);

    // REGISTER USER
    socket.on("register-user", (userId) => {
        onlineUsers[userId] = socket.id;
        console.log(onlineUsers);
    });
    // JOIN CHAT ROOM
    socket.on("join-chat", (chatId) => {
        socket.join(chatId);
        console.log(`socket ${socket.id} joined chat ${chatId}`);
    });

    // SEND MESSAGE
    socket.on("send-message", async (data) => {
        console.log(data);
        // save message in database here

        const savedMessage=await Chat.create({
            meetingId: data.meetingId,
            senderId: data.senderId,
            receiverId: data.receiverId,
            text: data.text,
        })

        // then send message to everyone in that room
        io.to(data.chatId).emit("receive-message", savedMessage);

    });

    socket.on("disconnect", () => {
        console.log("user disconnected :", socket.id);
        for (const userId in onlineUsers) {
            if (onlineUsers[userId] === socket.id) {
                delete onlineUsers[userId];
            }
        }
        console.log(onlineUsers);
    });
});

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

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
