import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

const ChatPage = () => {
    const {meetingId}=useParams()
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    const fetchMessages = async () => {
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
            console.log(data.messages);
            setMessages(data.messages);
        }catch(error) {
            console.error(error)
            alert(error.message)
        }
    }

    useEffect(() => {
        socket.emit("join-chat", meetingId);

        fetchMessages();
    }, []);

    return (
        <>
        <div>hello from chat</div>
        </>
    )
}
export default ChatPage;