import {useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import socket from "../socket.js";
import {useAuth} from "../../context/AuthContext.jsx";

const ChatPage = () => {
    const {meetingId}=useParams()
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [meetingData, setMeetingData] = useState({});
    const [onlineUsers,setOnlineUsers]=useState([])
    const [isloading, setIsloading] = useState(true);

    const messageEndRef=useRef(null);

    const {user}=useAuth();
    // console.log('log in user',user._id)
    // console.log('entrep Id',meetingData?.entrepreneurId?._id)

    const fetchMessages = async () => {
        setIsloading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/chat/messages/${meetingId}`, {
                method: "GET",
                credentials:'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            // console.log(data.messages);
            setMessages(data.messages);
        }catch(error) {
            console.error(error)
            alert(error.message)
        }finally {
            setIsloading(false);
        }
    }

    const fetchMeeting=async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/meeting/single-meeting/${meetingId}`, {
                method:"GET",
                credentials:'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            console.log('meeting data',data.meeting);
            setMeetingData(data.meeting)
        }catch (e) {
            console.log(e.message)
        }
    }

    const sendMessage=()=>{
        if (!message.trim()) return;

        socket.emit("send-message",{
            meetingId,
            senderId:user._id,
            receiverId,
            text:message,
        })
        setMessage('')
    }

    const receiverId=user?._id === meetingData?.investorId?._id ? meetingData?.entrepreneurId?._id : meetingData?.investorId?._id;
    const showName = user?._id === meetingData?.entrepreneurId?._id
            ? meetingData?.investorId?.username
            : meetingData?.entrepreneurId?.username;
    const isOnline= null;
    // onlineUsers?.includes(receiverId)

    useEffect(() => {
        socket.on("online-users", (users) => {
            setOnlineUsers(users);
            console.log('online users',users);
        });
        return () => {
            socket.off("online-users");
        };

    }, []);

    useEffect(() => {
        socket.emit("join-chat", meetingId);

        socket.on("receive-message",(newMessage) => {
            setMessages(prev => [...prev, newMessage]);
        })

        fetchMeeting();

        return () => {
            socket.off("receive-message")
        }
    }, []);

    useEffect(() => {
       if (messageEndRef.current){
           messageEndRef?.current.scrollIntoView({behavior: "smooth"});
       }
    }, [messages]);

    useEffect(() => {
        fetchMessages();
    }, []);

    useEffect(() => {
        if(user?._id){
            socket.emit("register-user", user._id);
        }
    }, [user]);

    if (isloading) {
        return (
            <div className="h-screen flex justify-center items-center w-full bg-[#060B14]">
                <p className="font-bold text-cyan-400 animate-pulse">Loading...</p>
            </div>
        )
    }

    return (
        <>
            <div className="h-screen bg-[#0B0E14] text-white flex flex-col">

                {/* HEADER */}
                <div className="bg-gray-800 p-4 border-b border-violet-500">
                    <h2 className="text-xl font-bold">
                        Chat Room
                    </h2>

                    <p className="text-sm text-gray-400">
                        Meeting ID: {meetingId}
                    </p>
                </div>

                {/* MESSAGES */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">

                    {messages.map((msg) =>{

                        const senderName =
                            msg.senderId?.toString() === user?._id
                                ? user.username
                                : showName;

                        return (
                            <div
                                key={msg._id}
                                className={`max-w-[70%] p-3 rounded-lg
                ${
                                    msg.senderId === user?._id
                                        ? "bg-violet-600 self-end"
                                        : "bg-gray-700 self-start"
                                }`}
                            >
                                <p className={isOnline ? "text-green-500" : "text-gray-500"}>
                                    {isOnline ? "Online" : "Offline"}
                                </p>
                                <h3 className={`font-bold text-lg text-gray-200 ${msg.senderId === user?._id ? 'text-gray-300' : 'text-violet-400'}`}>{senderName ? senderName?.charAt(0).toUpperCase()+senderName.slice(1) : 'unknown user'}</h3>
                                <p>{msg.text}</p>

                                <p className="text-xs mt-1 opacity-70">
                                    {new Date(msg.createdAt).toLocaleTimeString()}
                                </p>
                            </div>
                        )
                    })}

                    <div ref={messageEndRef}></div>

                </div>

                {/* INPUT */}
                <div className="p-4 border-t border-gray-700 flex gap-2">

                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-800 p-3 rounded-md outline-none"
                    />

                    <button
                        onClick={sendMessage}
                        className="bg-violet-600 px-5 rounded-md hover:bg-violet-700"
                    >
                        Send
                    </button>

                </div>

            </div>
        </>
    )
}
export default ChatPage;