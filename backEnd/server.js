import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { connectToDb } from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import meetingRoutes from "./routes/meeting.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import documentRoutes from "./routes/document.routes.js";
import cookieParser from "cookie-parser";
import { sendOTPEmail } from "./services/email.service.js";
import Chat from "./models/chat.model.js";
import { onlineUsers } from "./socket/onlineUsers.js";
import { setIo } from "./socket/socket.js";

dotenv.config();

const app = express();
const port = 3000;
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }
});

setIo(io);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

connectToDb();

// ----- routes (unchanged) -----
app.use("/api/auth", userRoutes);
app.use("/api/meeting", meetingRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/document", documentRoutes);
app.use("/api/chat", chatRoutes);


io.on("connection", (socket) => {

    console.log("user connected:", socket.id);

    socket.on("register-user", (userId) => {
        onlineUsers[userId] = socket.id;
        io.emit("online-users", onlineUsers);
    });

    socket.on("join-chat", (chatId) => {
        socket.join(chatId);
    });

    socket.on("send-message", async (data) => {
        const savedMessage = await Chat.create({
            meetingId: data.meetingId,
            senderId: data.senderId,
            receiverId: data.receiverId,
            text: data.text,
        });
        io.to(data.meetingId).emit("receive-message", savedMessage);
    });

    socket.on("join-room", (meetingId) => {
        socket.join(meetingId);
        socket.to(meetingId).emit("user-joined");
    });

    socket.on("call-user", (meetingId) => {
        socket.to(meetingId).emit("incoming-call");
    });

    socket.on("accept-call", (meetingId) => {
        socket.to(meetingId).emit("call-accepted");
    });

    socket.on("decline-call", (meetingId) => {
        socket.to(meetingId).emit("call-declined");
    });

    socket.on("end-call", (meetingId) => {
        socket.to(meetingId).emit("call-ended");
    });

    socket.on("offer", ({ meetingId, offer }) => {
        socket.to(meetingId).emit("offer", offer);
    });

    socket.on("answer", ({ meetingId, answer }) => {
        socket.to(meetingId).emit("answer", answer);
    });

    socket.on("ice-candidate", ({ meetingId, candidate }) => {
        socket.to(meetingId).emit("ice-candidate", candidate);
    });

    socket.on("leave-room", (meetingId) => {
        socket.to(meetingId).emit("user-left");
        socket.leave(meetingId);
    });

    socket.on("disconnect", () => {
        console.log("user disconnected:", socket.id);

        for (const userId in onlineUsers) {
            if (onlineUsers[userId] === socket.id) {
                delete onlineUsers[userId];
            }
        }
        io.emit("online-users", onlineUsers);

    });

});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get("/test-email", async (req, res) => {
    const response = await sendOTPEmail("mehdichandia76@gmail.com", "483920");
    res.json(response);
});

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});