import { useEffect, useRef, useState } from "react";
import socket from "../socket.js";
import { useParams } from "react-router-dom";

const ICE_SERVERS = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const VideoCall = () => {

    const { meetingId } = useParams();

    const myVideo = useRef(null);
    const remoteVideo = useRef(null);
    const peerConnection = useRef(null);
    const localStream = useRef(null);

    const [callStatus, setCallStatus] = useState("idle");
    const [otherPersonPresent, setOtherPersonPresent] = useState(false);

    const setupPeerConnection = () => {
        const pc = new RTCPeerConnection(ICE_SERVERS);

        if (localStream.current) {
            localStream.current.getTracks().forEach((track) => {
                pc.addTrack(track, localStream.current);
            });
        }

        pc.ontrack = (event) => {
            if (remoteVideo.current) {
                remoteVideo.current.srcObject = event.streams[0];
            }
            setCallStatus("in-call");
        };

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("ice-candidate", {
                    meetingId,
                    candidate: event.candidate,
                });
            }
        };

        peerConnection.current = pc;
    };

    const resetCall = () => {
        if (remoteVideo.current) {
            remoteVideo.current.srcObject = null;
        }
        peerConnection.current?.close();
        setupPeerConnection();
        setCallStatus("idle");
    };

    useEffect(() => {

        const init = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });
                localStream.current = stream;

                if (myVideo.current) {
                    myVideo.current.srcObject = stream;
                }

                setupPeerConnection();

                socket.emit("join-room", meetingId);
            } catch (error) {
                console.log("Setup error:", error);
            }
        };

        init();

        return () => {
            localStream.current?.getTracks().forEach((track) => track.stop());
            peerConnection.current?.close();
            socket.emit("leave-room", meetingId);
        };

    }, [meetingId]);

    useEffect(() => {
        const handleUserJoined = () => setOtherPersonPresent(true);

        const handleUserLeft = () => {
            setOtherPersonPresent(false);
            resetCall();
        };

        socket.on("user-joined", handleUserJoined);
        socket.on("user-left", handleUserLeft);
        return () => {
            socket.off("user-joined", handleUserJoined);
            socket.off("user-left", handleUserLeft);
        };
    }, []);

    useEffect(() => {
        const handleIncomingCall = () => setCallStatus("ringing");
        socket.on("incoming-call", handleIncomingCall);
        return () => socket.off("incoming-call", handleIncomingCall);
    }, []);

    useEffect(() => {
        const handleCallAccepted = async () => {
            const offer = await peerConnection.current.createOffer();
            await peerConnection.current.setLocalDescription(offer);
            socket.emit("offer", { meetingId, offer });
            setCallStatus("in-call");
        };

        socket.on("call-accepted", handleCallAccepted);
        return () => socket.off("call-accepted", handleCallAccepted);
    }, [meetingId]);

    useEffect(() => {
        const handleCallDeclined = () => setCallStatus("idle");
        socket.on("call-declined", handleCallDeclined);
        return () => socket.off("call-declined", handleCallDeclined);
    }, []);

    useEffect(() => {
        const handleCallEnded = () => resetCall();
        socket.on("call-ended", handleCallEnded);
        return () => socket.off("call-ended", handleCallEnded);
    }, []);

    useEffect(() => {
        const handleOffer = async (offer) => {
            await peerConnection.current.setRemoteDescription(offer);
            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);
            socket.emit("answer", { meetingId, answer });
        };

        socket.on("offer", handleOffer);
        return () => socket.off("offer", handleOffer);
    }, [meetingId]);

    useEffect(() => {
        const handleAnswer = async (answer) => {
            await peerConnection.current.setRemoteDescription(answer);
        };

        socket.on("answer", handleAnswer);
        return () => socket.off("answer", handleAnswer);
    }, []);

    useEffect(() => {
        const handleIceCandidate = async (candidate) => {
            try {
                await peerConnection.current.addIceCandidate(candidate);
            } catch (error) {
                console.log("Error adding ICE candidate:", error);
            }
        };

        socket.on("ice-candidate", handleIceCandidate);
        return () => socket.off("ice-candidate", handleIceCandidate);
    }, []);

    const handleStartCall = () => {
        socket.emit("call-user", meetingId);
        setCallStatus("calling");
    };

    const handleAccept = () => {
        socket.emit("accept-call", meetingId);
        setCallStatus("in-call");
    };

    const handleDecline = () => {
        socket.emit("decline-call", meetingId);
        setCallStatus("idle");
    };

    const handleEndCall = () => {
        socket.emit("end-call", meetingId);
        resetCall();
    };

    const statusText = {
        idle: otherPersonPresent ? "Ready to call" : "Waiting for the other person to join...",
        calling: "Calling...",
        ringing: "Incoming call",
        "in-call": "Call in progress",
    }[callStatus];

    return (
        <div className="min-h-screen bg-black text-white p-10">

            <p className="mb-5 text-violet-300">{statusText}</p>

            <div className="flex gap-3 mb-5">

                {callStatus === "idle" && otherPersonPresent && (
                    <button
                        onClick={handleStartCall}
                        className="bg-violet-600 px-5 py-2 rounded"
                    >
                        Call
                    </button>
                )}

                {callStatus === "calling" && (
                    <button
                        onClick={handleEndCall}
                        className="bg-red-600 px-5 py-2 rounded"
                    >
                        Cancel
                    </button>
                )}

                {callStatus === "ringing" && (
                    <>
                        <button
                            onClick={handleAccept}
                            className="bg-green-600 px-5 py-2 rounded"
                        >
                            Accept
                        </button>
                        <button
                            onClick={handleDecline}
                            className="bg-red-600 px-5 py-2 rounded"
                        >
                            Decline
                        </button>
                    </>
                )}

                {callStatus === "in-call" && (
                    <button
                        onClick={handleEndCall}
                        className="bg-red-600 px-5 py-2 rounded"
                    >
                        End call
                    </button>
                )}

            </div>

            <div className="flex gap-10">

                <div>
                    <h2>My Video</h2>
                    <video
                        ref={myVideo}
                        autoPlay
                        playsInline
                        muted
                        className="w-96 border"
                    />
                </div>

                <div>
                    <h2>Remote Video</h2>
                    <video
                        ref={remoteVideo}
                        autoPlay
                        playsInline
                        className="w-96 border"
                    />
                </div>

            </div>

        </div>
    );

};

export default VideoCall;