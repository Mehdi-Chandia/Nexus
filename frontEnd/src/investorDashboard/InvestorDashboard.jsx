import notifGif from "../../src/assets/notification.gif"
import chatGif from "../../src/assets/chat.gif"
import emailGif from "../../src/assets/email.gif"
import meetingGif from "../../src/assets/meeting.gif"
import videoIcon from "../../src/assets/video.gif"
import fileIcon from "../../src/assets/docs.gif"
import paymentIcon from "../../src/assets/payments.gif"
import transactionIcon from "../../src/assets/transactions.png"
import profileIcon from "../../src/assets/profile.gif"
import settingsIcon from "../../src/assets/setting.gif"
import walletIcon from "../../src/assets/wallet.png"
import crossIcon from "../../src/assets/cross.gif"
import graphIcon from "../../src/assets/graph.png"
import notificationIcon from "../../src/assets/notification.png"
import folderIcon from "../../src/assets/folder.gif"
import friendsIcon from "../../src/assets/friends.png"
import overviewGif from "../../src/assets/comic.png"
import investorIcon from "../../src/assets/investors.png"
import { useAuth } from "../../context/AuthContext.jsx"
import { useEffect, useState } from "react"
import {Link, useNavigate} from "react-router-dom"
import socket from "../socket.js";
import {toast} from "react-toastify";
import Footer from "../components/Footer.jsx";

const InvestorDashboard = () => {

    const [startups, setStartups] = useState([])
    const [meetings, setMeetings] = useState([])
    const [notifications, setNotifications] = useState([])
    const [documents, setDocuments] = useState([])
    const [singleMeeting, setSingleMeeting] = useState({})
    const [activeSection, setActiveSection] = useState('overview')
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [showInvestModal,setShowInvestModal]=useState(false);
    const [selectedEntrepreneur,setSelectedEntrepreneur]=useState(null);
    const [amount,setAmount]=useState("");
    const [loadingPayment,setLoadingPayment]=useState(false);
    const [paymentError,setPaymentError]=useState("");
    const [meetingId, setMeetingId]=useState(null);
    const [transactions,setTransactions]=useState([]);

    const navigate = useNavigate()
    const { user, isLoading } = useAuth()
    // console.log(user);

    // get all transactions
    const getTransactions=async ()=>{
        try {
            const response=await fetch("http://localhost:3000/api/payment/getAll",{
                method:'GET',
                credentials:'include',
                headers:{
                    'Content-Type': 'application/json'
                }
            })

            const data=await response.json();
            if (!response.ok){
                throw new Error( data.message ||"Transaction failed." );
            }
            // console.log('transactions',data.payments)
            setTransactions(data?.payments)

        }catch (e) {
            console.log(e.message)
        }
    }

    const logout = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/auth/logout", {
                method: "GET",
                credentials: 'include',
                headers: { 'Accept': 'application/json' }
            })
            const res = await response.json()
            if (!response.ok) throw new Error(res.message)
            alert("logout successfully")
            navigate("/login")
        } catch (e) {
            alert(e.message)
        }
    }

    /* fetch all entrepreneurs/startups */
    const getStartups = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/auth/get-all-users", {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            })
            const res = await response.json()
            if (!response.ok) throw new Error(res.message)
            const entrepreneurs = res.users.filter(u => u.role === 'entrepreneur')
            setStartups(entrepreneurs)
        } catch (err) {
            console.log(err.message)
        }
    }

    /* fetch meetings for this investor */
    const getAllMeetings = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/meeting/all-meetings", {
                method: "GET",
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            })
            const res = await response.json()
            if (!response.ok) throw new Error(res.message)
            setMeetings(res.meetings)
        } catch (e) {
            console.log(e)
        }
    }

    /* fetch notifications */
    const getAllNotifications = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/notification/getAllNotifications", {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            })
            const res = await response.json()
            if (!response.ok) throw new Error(res.message)
            setNotifications(res.notifications)
        } catch (err) {
            console.log(err.message)
        }
    }

    // single meeting
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
            // console.log('meeting data',data.meeting);
            setSingleMeeting(data.meeting);
        }catch (e) {
            console.log(e.message)
        }
    }

    const fetchDocuments=async () =>{
        try {
            const response=await fetch("http://localhost:3000/api/document/getAllDocs",{
                method:"GET",
                credentials:'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            const data=await response.json();
            if (!response.ok){
                throw new Error(data.message);
            }

            // console.log("docs",data.documents)

            setDocuments(data.documents)
        }catch(err){
            console.log(err)
            alert(err.message)
        }
    }

    const acceptMeeting=async (meetingId)=>{
        try {
            const response=await fetch(`http://localhost:3000/api/meeting/accept/${meetingId}`,{
                method:"GET",
                credentials:'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            const res=await response.json();
            if(!response.ok){
                throw new Error(res.message)
            }
           toast.success(res.message)
        }catch (err){
            console.log(err.message)
        }
    }

    const rejectMeeting=async (meetingId)=>{
        try {
            const response=await fetch(`http://localhost:3000/api/meeting/reject/${meetingId}`,{
                method:"POST",
                credentials:'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            const res=await response.json();
            if(!response.ok){
                throw new Error(res.message)
            }
            toast.success(res.message)
        }catch (err){
            console.log(err.message)
        }
    }

    const handleInvestment=async ()=>{
        setPaymentError("");
        if(!amount){
            return setPaymentError(
                "Amount is required"
            );
        }
        if(Number(amount)<100){
            return setPaymentError(
                "Minimum investment is 100"
            );
        }
        try {
            setLoadingPayment(true)
            const response=await fetch(`http://localhost:3000/api/payment/create/${meetingId}`,{
                method:'POST',
                credentials:'include',
                headers: {
                   'Content-Type':"application/json",
                },
                body:JSON.stringify({
                    amount:Number(amount),
                })
            })
            const res=await response.json();
            if(!response.ok){
                throw new Error(res.message)
            }
            // console.log(res)
            window.location.href=res.url
            setMeetingId(null)
        }catch (e) {
            console.log(e.message)
            setPaymentError(e.message)
        }finally {
            setLoadingPayment(false)
        }
    }

    /* only accepted meetings */
    const acceptedMeetings = meetings.filter(m => m.status === 'accepted')
    // console.log('accepted meetings of investor',acceptedMeetings)

    /* pending meeting requests investor needs to act on */
    const pendingMeetings = meetings.filter(m => m.status === 'pending')
    // console.log('pending',pendingMeetings)

    /* redirect if not logged in */
    useEffect(() => {
        if (isLoading) return;

        if (!user) {
            navigate("/login");
            return;
        }

        if (user.role === "entrepreneur") {
            navigate("/dashboard");
            return;
        }

        if (user.role !== "investor") {
            navigate("/login");
        }

    }, [user, isLoading, navigate]);

    useEffect(() => {
        // socket.emit("send-message",{
        //     text:'hello from dashboard'
        // })
        //
        // socket.on("receive_message", (data) => {
        //     console.log("From server:", data);
        // });
        // return ()=>{
        //     socket.off("receive_message");
        // }
        // socket.emit('join-room','meeting123')
        // socket.on("room-message", (msg) => {
        //     console.log(msg)
        // })
        if (user?._id){
            socket.emit('register-user',user._id)
        }
    }, [user]);

    useEffect(() => {
        // console.log("Registering notification listener");
        socket.on(
            "new-notification",
            (notification) => {
                console.log(notification);
                toast.info(notification?.message || 'you have a new notification');
            }
        );

        return () => {
            socket.off("new-notification")
        }
    }, []);

    useEffect(()=>{
        socket.on(
            "dashboard-update",
            (data)=>{

                console.log(
                    "dashboard updated",
                    data
                );
                getAllMeetings()
                getAllNotifications()
                fetchDocuments();

            }
        );

        return ()=>{
            socket.off(
                "dashboard-update"
            );
        };
    },[]);


    useEffect(() => {
        // console.log('socket id of user ',socket.id)
        getStartups()
        fetchDocuments()
        getAllMeetings()
        getAllNotifications()
        getTransactions();
    }, [])

    /* sidebar nav config */
    const mainSection = [
        { id: 'overview', title: 'Overview', icon: overviewGif },
        { id: 'notification', title: 'Notifications', icon: notifGif },
        { id: 'meeting', title: 'Meetings', icon: meetingGif },
        { id: 'chat', title: 'Chat', icon: chatGif },
    ]
    const collabSection = [
        { id: 'startups', title: 'Startups', icon: friendsIcon },
        { id: 'videoCall', title: 'Video Call', icon: videoIcon },
        { id: 'documents', title: 'Documents', icon: fileIcon },
    ]
    const financeSection = [
        { id: 'payment', title: 'Payment', icon: paymentIcon },
        { id: 'transactions', title: 'Transactions', icon: transactionIcon },
    ]
    const accountSection = [
        { id: 'profile', title: 'Profile', icon: profileIcon },
        { id: 'settings', title: 'Settings', icon: settingsIcon },
    ]

    /* set active tab and close mobile sidebar */
    const handleSectionClick = (id) => {
        setActiveSection(id)
        setSidebarOpen(false)
    }

    /* sidebar single item */
    const SidebarItem = ({ item }) => (
        <div
            onClick={() => handleSectionClick(item.id)}
            className={`flex gap-2 p-2 cursor-pointer rounded-md transition-all duration-200
                ${activeSection === item.id
                ? 'bg-cyan-700 text-white'
                : 'hover:bg-slate-700 text-gray-300'}`}>
            <img className="invert" src={item.icon} alt={item.title} width={24} />
            <p className="text-sm">{item.title}</p>
        </div>
    )

    if (isLoading) {
        return (
            <div className="h-screen flex justify-center items-center w-full bg-[#060B14]">
                <p className="font-bold text-cyan-400 animate-pulse">Loading...</p>
            </div>
        )
    }

    /* ── status badge color helper ── */
    const statusColor = (status) => {
        if (status === 'accepted') return 'bg-green-600 text-white'
        if (status === 'pending') return 'bg-yellow-500 text-black'
        return 'bg-red-500 text-white'
    }



    /* ── overview: summary cards + quick lists ── */
    const renderOverview = () => (
        <>
            {/* stats cards */}
            <div className="flex flex-wrap justify-around gap-4 p-4">

                <div className="bg-[#0D1626] text-center p-5 rounded-xl border border-cyan-500 shadow-[0_0_14px_rgba(6,182,212,0.35)]">
                    <div className="flex gap-2 justify-center items-center mb-1">
                        <img src={friendsIcon} alt="startups" className="invert" width={28} />
                        <p className="bg-cyan-700 px-2 rounded-full text-xs text-white">{startups.length} Listed</p>
                    </div>
                    <h3 className="text-3xl font-bold text-cyan-400">{startups.length}</h3>
                    <p className="text-[#8B9DC3] text-xs mt-1">Startups Available</p>
                </div>

                <div className="bg-[#0D1626] text-center p-5 rounded-xl border border-gray-500 shadow-[0_0_14px_rgba(156,163,175,0.3)]">
                    <div className="flex gap-2 justify-center items-center mb-1">
                        <img src={meetingGif} alt="meetings" className="invert" width={28} />
                        <p className="bg-gray-600 px-2 rounded-full text-xs text-white">{pendingMeetings.length} Pending</p>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-400">{meetings.length}</h3>
                    <p className="text-[#8B9DC3] text-xs mt-1">Total Meetings</p>
                </div>

                <div className="bg-[#0D1626] text-center p-5 rounded-xl border border-emerald-500 shadow-[0_0_14px_rgba(52,211,153,0.3)]">
                    <div className="flex gap-2 justify-center items-center mb-1">
                        <img src={fileIcon} alt="docs" className="invert" width={28} />
                        <p className="bg-emerald-700 px-2 rounded-full text-xs text-white">3 New</p>
                    </div>
                    <h3 className="text-3xl font-bold text-emerald-400">8</h3>
                    <p className="text-[#8B9DC3] text-xs mt-1">Pitch Decks </p>
                </div>

                <div className="bg-[#0D1626] text-center p-5 rounded-xl border border-yellow-500 shadow-[0_0_14px_rgba(234,179,8,0.3)]">
                    <div className="flex gap-2 justify-center items-center mb-1">
                        <img src={walletIcon} alt="wallet" className="invert" width={28} />
                        <p className="bg-yellow-500 px-2 rounded-full text-xs text-black">Active</p>
                    </div>
                    <h3 className="text-3xl font-bold text-yellow-400"><span className="text-green-400">$</span>{user?.investmentMax || '0.00'}</h3>
                    <p className="text-[#8B9DC3] text-xs mt-1">Total Wallet</p>
                </div>

            </div>

            {/* quick lists: pending requests + top startups */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-3">

                {/* pending meeting requests */}
                <div className="bg-[#0D1626] p-4 rounded-xl border border-gray-700">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            <img src={meetingGif} alt="meeting" className="invert" width={24} />
                            <p className="font-semibold text-gray-300">Meeting Requests</p>
                        </div>
                        <p onClick={() => handleSectionClick('meeting')} className="text-xs text-cyan-400 hover:text-cyan-300 cursor-pointer">see all</p>
                    </div>
                    <div className="h-px w-full bg-gray-700 mb-3"></div>

                    {pendingMeetings.length > 0 ? (
                        pendingMeetings.slice(0, 3).map((m) => (
                            <div key={m._id} className="flex justify-between items-center py-3 border-b border-gray-800">
                                <div>
                                    <p className="text-sm font-medium text-white">{m.title || 'Meeting Request'}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{m.agenda || 'No description'}</p>
                                </div>
                                <div className="flex gap-2">
                                    {/* accept / decline buttons*/}
                                    <button onClick={()=> acceptMeeting(m._id)} className="text-xs bg-green-700 hover:bg-green-600 text-white
                                     px-3 py-1 rounded-full transition-all duration-200">Accept</button>
                                    <button onClick={()=> rejectMeeting(m._id)} className="text-xs bg-red-800 hover:bg-red-700 text-white px-3 py-1
                                     rounded-full transition-all duration-200">Decline</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600 text-sm py-6 text-center">No pending requests right now.</p>
                    )}
                    <div className="h-px w-full bg-cyan-800 mt-3"></div>
                </div>

                {/* top startups preview */}
                <div className="bg-[#0D1626] p-4 rounded-xl border border-gray-700">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            <img src={friendsIcon} alt="startups" className="invert" width={24} />
                            <p className="font-semibold text-gray-300">Browse Startups</p>
                        </div>
                        <p onClick={() => handleSectionClick('startups')} className="text-xs text-cyan-400 hover:text-cyan-300 cursor-pointer">see all</p>
                    </div>
                    <div className="h-px w-full bg-gray-700 mb-3"></div>

                    {startups.slice(0, 3).map((s) => (
                        <div key={s._id} className="flex justify-between items-center py-3 border-b border-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="bg-cyan-900 text-cyan-300 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shrink-0">
                                    {s.username?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">{s.username}</p>
                                    <p className="text-xs text-gray-500">{s.companyName || 'No company'}</p>
                                </div>
                            </div>
                            <span className="text-xs text-cyan-400 border border-cyan-700 rounded-full px-2 py-0.5">
                                {s.industryInterested || 'N/A'}
                            </span>
                        </div>
                    ))}

                    {startups.length === 0 && (
                        <p className="text-gray-600 text-sm py-6 text-center">No startups found.</p>
                    )}
                    <div className="h-px w-full bg-cyan-800 mt-3"></div>
                </div>

            </div>

            {/* notifications + documents */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-3">

                {/* recent notifications */}
                <div className="bg-[#0D1626] p-4 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-2 mb-3">
                        <img src={graphIcon} alt="activity" className="invert" width={22} />
                        <p className="font-semibold text-gray-300">Recent Activity</p>
                    </div>
                    <div className="h-px w-full bg-gray-700 mb-3"></div>

                    {notifications.length > 0 ? (
                        notifications.slice(0, 4).map((n) => (
                            <div key={n._id} className="flex items-center gap-3 py-2 border-b border-gray-800">
                                <img src={notificationIcon} alt="notif" className="invert shrink-0" width={20} />
                                <div>
                                    <p className="text-yellow-400 text-sm">{n.message}</p>
                                    <p className="text-xs text-gray-600 mt-0.5">3 hours ago</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600 text-sm py-6 text-center">No notifications yet.</p>
                    )}
                </div>

                {/* pitch decks / documents */}
                <div className="bg-[#0D1626] p-4 rounded-xl border border-gray-700">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            <img src={folderIcon} alt="docs" className="invert" width={24} />
                            <p className="font-semibold text-gray-300">Pitch Decks</p>
                        </div>
                        <p onClick={()=> setActiveSection('documents')} className="text-xs text-cyan-400 hover:text-cyan-300 cursor-pointer">see all</p>
                    </div>
                    <div className="h-px w-full bg-gray-700 mb-3"></div>

                    {/* static placeholder — replace with real docs data when ready */}
                    {documents.length > 0 ? (
                        documents.map((document,index) => (
                            <>
                                <div key={document?._id || index} className="flex justify-between items-center py-3 border-b border-gray-800">
                                    <div className="flex items-center gap-3">
                                        <img src={fileIcon} alt="file" className="invert" width={24} />
                                        <div>
                                            <p className="text-sm text-white font-medium">{document.documentType || 'Pitch Deck'}</p>
                                            <p className="text-xs text-gray-500">Meeting Date : {new Date(document.meetingDate).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs bg-yellow-200 text-gray-800 rounded-full px-2 py-0.5">Under Review</span>
                                </div>
                                <div className="h-px w-full bg-cyan-800 mt-3"></div>
                            </>
                        ))
                    ) : (<p className="text-gray-600 text-sm py-6 text-center">No Documents Uploaded yet.</p>)}
                </div>

            </div>
        </>
    )

    /* ── all meetings view ── */
    const renderMeetings = () => (
        <div className="p-4">
            <h2 className="text-xl font-bold text-cyan-400 mb-4">All Meetings</h2>
            <div className="bg-[#0D1626] rounded-xl border border-gray-700 overflow-hidden">
                {meetings.length > 0 ? (
                    meetings.map((m) => (
                        <div key={m._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 border-b border-gray-800 hover:bg-[#111c30] transition-all duration-200">
                            <div className="flex items-center gap-3">
                                <img src={meetingGif} alt="meeting" className="invert" width={24} />
                                <div>
                                    <p className="text-sm font-medium text-white">{m.entrepreneurId.username.charAt(0).toUpperCase() + m.entrepreneurId.username.slice(1) || 'Meeting'}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{m.agenda || 'No description'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <p> <span className='text-cyan-400'>Start Time :</span> {new Date(m.startTime).toLocaleString()}</p>
                                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${statusColor(m.status)}`}>
                                    {m.status}
                                </span>
                                {m.status === 'accepted' && (
                                    <img onClick={()=> navigate(`/video-call/${m._id}`)} src={videoIcon} alt="video" className="invert" width={24} />
                                )}
                                {m.status === 'accepted' && (<Link className="hover:text-cyan-400 hover:border-b
                                border-cyan-400 transition-all duration-200" to={`/meeting/${m._id}`}>view details</Link>)}
                                {/* decline button for pending */}
                                {m.status === 'pending' && (
                                    // <img src={crossIcon} alt="decline" className="invert cursor-pointer" width={22} />
                                    <div className="space-y-2 space-x-2 md:space-x-3">
                                        <button onClick={()=> acceptMeeting(m._id)} className="px-2 md:px-4 py-2 bg-cyan-400 rounded-md hover:bg-cyan-500
                                 transition-all duration-200">Accept</button>
                                        <button onClick={()=> rejectMeeting(m._id)} className="px-2 md:px-4 py-2 bg-cyan-400 rounded-md hover:bg-cyan-500
                                 transition-all duration-200">Reject</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <img src={meetingGif} alt="no meetings" className="invert opacity-20 mb-4" width={50} />
                        <p className="text-gray-500">No meetings yet.</p>
                    </div>
                )}
            </div>
        </div>
    )


    // video call section

    const renderVideoCall = () => (
        <div className="p-4">
            <h2 className="text-xl font-bold text-cyan-400 mb-4">Start Calling with Entrepreneurs</h2>
            <div className="bg-[#0D1626] rounded-xl border border-gray-700 overflow-hidden">
                {acceptedMeetings.length > 0 ? (
                    acceptedMeetings.map((m) => (
                        <div key={m._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 border-b border-gray-800 hover:bg-[#111c30] transition-all duration-200">
                            <div className="flex items-center gap-3">
                                <img src={meetingGif} alt="meeting" className="invert" width={24} />
                                <div>
                                    <p className="text-sm font-medium text-white">{m.entrepreneurId.username || 'Meeting'}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{m.agenda || 'No description'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <p> <span className='text-cyan-400'>Meeting Start Time :</span> {new Date(m.startTime).toLocaleString()}</p>
                                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${statusColor(m.status)}`}>
                                    {m.status}
                                </span>
                                {m.status === 'accepted' && (
                                    <img onClick={()=> navigate(`/video-call/${m._id}`)} src={videoIcon} alt="video" className="invert" width={30} />
                                )}


                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <img src={meetingGif} alt="no meetings" className="invert opacity-20 mb-4" width={50} />
                        <p className="text-gray-500">No meetings yet.</p>
                    </div>
                )}
            </div>
        </div>
    )

    /* ── all notifications view ── */
    const renderNotifications = () => (
        <div className="p-4">
            <h2 className="text-xl font-bold text-cyan-400 mb-4">All Notifications</h2>
            <div className="bg-[#0D1626] rounded-xl border border-gray-700 overflow-hidden">
                {notifications.length > 0 ? (
                    notifications.map((n) => (
                        <div key={n._id} className="flex items-center gap-4 p-4 border-b border-gray-800 hover:bg-[#111c30] transition-all duration-200">
                            <img src={notificationIcon} alt="notif" className="invert shrink-0" width={24} />
                            <div className="flex-1">
                                <p className="text-yellow-400 text-sm font-medium">{n.message}</p>
                                <p className="text-xs text-gray-600 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <img src={notifGif} alt="no notifs" className="invert opacity-20 mb-4" width={50} />
                        <p className="text-gray-500">You're all caught up!</p>
                    </div>
                )}
            </div>
        </div>
    )

    /* ── all startups/entrepreneurs view ── */
    const renderStartups = () => (
        <div className="p-4">
            <h2 className="text-xl font-bold text-cyan-400 mb-4">All Startups</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {startups.length > 0 ? (
                    startups.map((s) => (
                        <div key={s._id} className="bg-[#0D1626] rounded-xl border border-gray-700 p-5 flex flex-col gap-3 hover:border-cyan-600 transition-all duration-200">
                            <div className="flex items-center gap-3">
                                <div className="bg-cyan-900 text-cyan-300 rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold shrink-0">
                                    {s.username?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-white">{s.username.charAt(0).toUpperCase() + s.username.slice(1) || 'No name'}</p>
                                    <p className="text-xs text-gray-400">{s.companyName || 'No company'}</p>
                                </div>
                            </div>
                            <div className="text-xs text-gray-400">
                                <span className="text-gray-300">Industry: </span>
                                {s.industry || 'N/A'}
                            </div>
                            <div className="flex gap-2 mt-auto">
                                <button className="flex-1 border border-cyan-600 text-cyan-400 py-2 rounded-full text-xs hover:bg-cyan-700 hover:text-white transition-all duration-200">
                                    View Profile
                                </button>
                                <button className="flex-1 border border-gray-600 text-gray-300 py-2 rounded-full text-xs hover:bg-gray-700 transition-all duration-200">
                                    Request Meeting
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                        <img src={friendsIcon} alt="no startups" className="invert opacity-20 mb-4" width={50} />
                        <p className="text-gray-500">No startups found.</p>
                    </div>
                )}
            </div>
        </div>
    )

    // chats section
    const renderChat = () => (
        <div className="p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold text-violet-400 mb-6">
                Connect with Investors
            </h2>

            <div className="bg-gray-800 rounded-xl p-4 md:p-6">
                {acceptedMeetings.length > 0 ? (
                    <div className="space-y-4">
                        {acceptedMeetings.map((meeting) => (
                            <div
                                key={meeting._id}
                                className="border border-violet-300 rounded-2xl p-4 flex flex-col lg:flex-row gap-4 lg:items-center
                                 lg:justify-betweenbg-gray-900" >
                                {/* Meeting details */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm md:text-base break-words">
                                        Meeting with{" "}
                                        <span className="font-bold text-violet-500">
                    {meeting.entrepreneurId.username}
                  </span>
                                    </p>

                                    <p className="text-yellow-400 text-sm mt-2">
                                        Agenda:
                                        <span className="text-gray-400 ml-2 break-words">
                    {meeting.agenda}
                  </span>
                                    </p>
                                </div>

                                {/* Date */}
                                <div className="flex-1">
                                    <p className="text-gray-200 text-sm">
                                        Scheduled on
                                    </p>

                                    <p className="text-gray-400 text-sm break-words">
                                        {new Date(meeting.startTime).toLocaleString()}
                                    </p>
                                </div>

                                {/* Status */}
                                <div className="flex justify-start lg:justify-center">
                <span
                    className=" bg-green-500 px-3 py-1rounded-full text-sm text-white w-fit">
                  {meeting.status}
                </span>
                                </div>

                                {/* Button */}
                                <div className="w-full lg:w-auto">
                                    <button
                                        onClick={() =>
                                            navigate(`/messages/${meeting._id}`)
                                        }
                                        className="w-full lg:w-autobg-violet-500 px-5 py-2 rounded-lg text-white hover:bg-violet-600
                                        transition-all duration-200 "
                                    >
                                        Start Chat
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <img
                            src={chatGif}
                            alt="investors"
                            className="invert opacity-30 mb-4"
                            width={60}
                        />
                        <p className="text-gray-500 text-sm md:text-lg">
                            Request Investors and connect with them.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );

    const renderDocuments=()=>(
        <div className='p-4'>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Uploaded Documents</h2>
           <div>
               {documents.length > 0 ? (
                   documents.map((doc) =>(
                           <div className="bg-gray-700 w-full h-full flex flex-col gap-3 p-3 ">
                               <div className="bg-gray-500 p-3 rounded-md flex justify-between items-center">
                                   <div>
                                       <p className="text-cyan-300 text-lg font-bold">{doc.documentType || 'Pitch Dark'}</p>
                                       <p className="text-gray-200 text-sm">Scheduled On : {new Date(doc.meetingDate).toLocaleString()}</p>
                                   </div>
                                   <a  className="text-gray-200 text-sm hover:text-cyan-400" href={doc.fileUrl} target={"_blank"}>View Document</a>
                               </div>
                           </div>
                       ))
               ) : (<p className="text-gray-500 text-xl">No Documents Uploaded Yet!</p>)}
           </div>

        </div>
    )

    const renderProfile = () => (
        <div className="p-4 md:p-8 mx-2 md:mx-8 rounded-2xl bg-[#0D1626] shadow-lg">
            <div className="flex flex-col items-center text-center gap-6">
                {/* Profile Section */}
                <div className="flex flex-col items-center">
                    <img
                        src={user?.profilePicture?.fileUrl}
                        alt="profile"
                        className="  w-24 h-24 md:w-32 md:h-32 rounded-full object-cover ring-4 ring-cyan-600 shadow-md"/>
                    <h2 className="mt-4 text-xl md:text-3xl font-bold text-cyan-400">
                        Mr. {user?.username}
                    </h2>
                    <p className="text-gray-400 text-sm md:text-lg capitalize">
                        {user?.role}
                    </p>
                    <p className="text-gray-300 text-sm md:text-base break-all mt-2">
                       <span className='text-yellow-300'> Email:</span> {user?.email}
                    </p>
                    <p className="text-gray-500 text-sm md:text-base break-all mt-2"> <span className="text-violet-500">Bio: </span> {user?.bio || 'No Bio'}</p>
                </div>
                {/* Company */}
                <div className="w-full bg-[#152238] rounded-xl p-4">
                    <p className="text-cyan-300 text-sm md:text-lg">
          <span className="text-blue-400 font-semibold">
            Company:
                        </span>{" "}
                        {user?.companyName || "No Company"}
                    </p>
                </div>
                {/* Wallet */}
                <div className="w-full bg-[#152238] rounded-xl p-4">
                    <h3 className="text-xl md:text-2xl text-gray-300 font-semibold mb-3">
                        Wallet
                    </h3>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <div className="bg-[#1B2A41] rounded-lg px-6 py-3">
                            <p className="text-green-500 font-bold">
                                Min
                            </p>
                            <p className="text-gray-300">
                                {user?.investmentMin || "0.00"}
                            </p>
                        </div>
                        <div className="bg-[#1B2A41] rounded-lg px-6 py-3">
                            <p className="text-red-500 font-bold">
                                Max
                            </p>
                            <p className="text-gray-300">
                                {user?.investmentMax || "0.00"}
                            </p>
                        </div>

                    </div>

                </div>

                {/* Industry */}
                <div className="w-full bg-[#152238] rounded-xl p-4">
                    <p className="text-gray-300 text-sm md:text-lg break-words">
          <span className="text-cyan-400 font-semibold">
            Industry Interested In:
                   </span>{" "}
                        {user?.industryInterested || "Tech"}
                    </p>
                </div>
            </div>
        </div>
    );

    const renderPayment = () => (
        <div className="p-4">
            <h2 className="text-xl font-bold text-green-400 mb-6">Investment Opportunities</h2>

            {meetings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                    {meetings.map((m) => (
                        <div key={m._id} className="bg-[#0D1626] border border-gray-700 rounded-2xl p-5 hover:scale-[1.02] hover:border-green-500 transition-all duration-300 shadow-md">

                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold text-lg">
                                    {m?.entrepreneurId?.username?.charAt(0).toUpperCase()}
                                </div>

                                <div>
                                    <p className="font-semibold text-white">{m?.entrepreneurId?.username || "Entrepreneur"}</p>
                                    <p className="text-xs text-gray-500">Startup Pitch</p>
                                </div>
                            </div>

                            <div className="mb-5">
                                <p className="text-sm text-cyan-400 mb-1">Agenda</p>
                                <p className="text-gray-300 line-clamp-2">{m.agenda || "No agenda available"}</p>
                            </div>

                            <button onClick={()=> {
                                setSelectedEntrepreneur(m.entrepreneurId)
                                setShowInvestModal(true)
                                setMeetingId(m._id)
                            }} className="w-full py-3 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition-all duration-200">
                                Invest Now
                            </button>

                        </div>
                    ))}

                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16">
                    <img src={meetingGif} alt="empty" className="invert opacity-20 mb-4" width={60}/>
                    <p className="text-gray-500">No investment opportunities available</p>
                </div>
            )}
        </div>
    )

    // transactions section

    const renderTransactions = () => (
        <div className="p-4">
            <h2 className="text-2xl font-bold text-cyan-400 mb-6">Investment Transactions</h2>

            {transactions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {transactions.map((t) => (
                        <div key={t._id} className="bg-[#0D1626] border border-cyan-900 rounded-2xl p-5 hover:border-cyan-500
                        hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
                            {/* Amount */}
                            <div className="flex justify-between items-center mb-5">
                                <p className="text-sm text-gray-400">Investment</p>
                                <p className="text-xl font-bold text-green-400">
                                    ${t.amount}
                                </p>
                            </div>
                            <div className="h-[1px] w-full bg-gray-700 mb-4"></div>
                            {/* Investor */}
                            <div className="mb-3">
                                <p className="text-xs text-cyan-500">Investor</p>
                                <p className="text-white font-semibold">
                                    {t.investorId?.username || "Unknown"}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Company: {t.investorId?.companyName || "No Company"}
                                </p>
                            </div>

                            {/* Entrepreneur */}
                            <div className="mb-3">
                                <p className="text-xs text-cyan-500">Entrepreneur</p>
                                <p className="text-white font-semibold">
                                    {t.entrepreneurId?.username || "Unknown"}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Startup: {t.entrepreneurId?.companyName || "No Startup"}
                                </p>
                            </div>
                            <div className="h-[1px] w-full bg-gray-700 my-4"></div>
                            {/* Status */}
                            <div className="flex justify-between items-center">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                t.paymentStatus === "completed"
                                    ? "bg-green-500 text-white"
                                    : "bg-yellow-400 text-gray-900"
                            }`}>
                                Completed
                            </span>

                                <p className="text-xs text-gray-500">
                                    {new Date(t.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16">
                    <p className="text-gray-500 text-lg">
                        No transactions available
                    </p>
                </div>
            )}
        </div>
    );

    /* pick what to render based on active section */
    const renderSection = () => {
        switch (activeSection) {
            case 'overview':      return renderOverview()
            case 'meeting':       return renderMeetings()
            case 'notification':  return renderNotifications()
            case 'startups':      return renderStartups()
            case 'chat':          return renderChat()
            case 'videoCall':     return renderVideoCall()
            case 'documents':     return renderDocuments()
            case 'payment':       return renderPayment()
            case 'transactions':  return renderTransactions()
            case 'profile':       return renderProfile()
            case 'settings':      return renderOverview()
            default:              return renderOverview()
        }
    }

    return (

        <div className="min-h-screen text-white bg-[#060B14]">

            {/* navbar */}
            <nav className="w-full h-16 bg-[#060B14] flex justify-between items-center px-4 border-b border-cyan-800 sticky top-0 z-40">

                {/* hamburger — mobile only */}
                <button
                    onClick={() => setSidebarOpen(prev => !prev)}
                    className="md:hidden flex flex-col gap-1.5 p-2 rounded-md hover:bg-slate-800 transition-all duration-200"
                    aria-label="Toggle menu">
                    <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${sidebarOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${sidebarOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${sidebarOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </button>

                {/* logo */}
                <div onClick={()=> setActiveSection('overview')} className="flex cursor-pointer items-center gap-1">
                    <p className="bg-cyan-400 rounded-md text-[#060B14] px-2 text-xl font-bold">N</p>
                    <h2 className="text-2xl font-bold text-cyan-400">Nexus</h2>
                </div>

                {/* right side */}
                <div className="flex items-center gap-3">
                    <span onClick={()=> setActiveSection('notification')} className='h-5 w-5 text-center top-3 cursor-pointer rounded-full bg-red-500 text-white text-sm absolute z-30'>{notifications.length}</span>
                    <img onClick={()=> setActiveSection('notification')} className="invert relative hover:cursor-pointer hidden sm:block" src={notifGif} alt="notifications" width={30} />
                    <img onClick={()=> setActiveSection('chat')} className="invert hover:cursor-pointer hidden sm:block" src={chatGif} alt="chat" width={26} />
                    <div className="hidden sm:flex items-center gap-2 border border-gray-700 p-2 rounded-md">
                        <img className="invert" src={emailGif} alt="email" width={22} />
                        <p className="text-xs text-gray-300">{user?.email || 'investor@nexus.com'}</p>
                    </div>
                    <img className="rounded-full ring-2 ring-cyan-600" src={user?.profilePicture?.fileUrl} alt="profile" width={30} />
                </div>
            </nav>

            {/* layout */}
            <div className="flex relative">

                {/* mobile backdrop */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 z-20 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* sidebar */}
                <aside className={`
                    fixed top-16 left-0 h-[calc(100vh-4rem)] z-30
                    bg-[#060B14] border-r border-cyan-900
                    transform transition-transform duration-300 ease-in-out
                    w-[230px] overflow-y-auto
                    md:sticky md:top-0 md:translate-x-0 md:h-[calc(100vh-4rem)]
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}>

                    {/* investor badge */}
                    <div className="p-3 m-3 rounded-lg bg-cyan-900/30 border border-cyan-800">
                        <div className="flex items-center gap-2">
                            <img src={investorIcon} alt="investor" className="invert" width={20} />
                            <div>
                                <p className="text-xs font-semibold text-cyan-300">{user?.username}</p>
                                <p className="text-[10px] text-gray-500">Investor Account</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 p-2">
                        <p className="text-xs text-gray-500 uppercase tracking-widest px-2 mb-1">Main</p>
                        {mainSection.map(item => <SidebarItem key={item.id} item={item} />)}
                    </div>
                    <div className="h-px bg-gray-800 w-[90%] mx-auto my-2"></div>

                    <div className="flex flex-col gap-1 p-2">
                        <p className="text-xs text-gray-500 uppercase tracking-widest px-2 mb-1">Collaboration</p>
                        {collabSection.map(item => <SidebarItem key={item.id} item={item} />)}
                    </div>
                    <div className="h-px bg-gray-800 w-[90%] mx-auto my-2"></div>

                    <div className="flex flex-col gap-1 p-2">
                        <p className="text-xs text-gray-500 uppercase tracking-widest px-2 mb-1">Finance</p>
                        {financeSection.map(item => <SidebarItem key={item.id} item={item} />)}
                    </div>
                    <div className="h-px bg-gray-800 w-[90%] mx-auto my-2"></div>

                    <div className="flex flex-col gap-1 p-2">
                        <p className="text-xs text-gray-500 uppercase tracking-widest px-2 mb-1">Account</p>
                        {accountSection.map(item => <SidebarItem key={item.id} item={item} />)}
                        <button
                            onClick={logout}
                            className="mt-2 px-4 py-2 bg-cyan-700 hover:bg-cyan-800 rounded-md text-sm transition-all duration-200">
                            LogOut
                        </button>
                    </div>

                </aside>

                {/* main content area */}
                <main className="flex-1 bg-[#060B14] min-h-[calc(100vh-4rem)] overflow-x-hidden">

                    {/* page header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 border-b border-gray-800">
                        <div>
                            <h2 className="font-bold text-2xl md:text-3xl">
                                Welcome back, <span className="text-cyan-400">Mr. {user?.username.charAt(0).toUpperCase() + user?.username.slice(1)}</span>
                            </h2>
                            <p className="text-[#8B9DC3] text-xs mt-1">Manage your investments and review startup opportunities.</p>
                        </div>
                        <button onClick={()=> setActiveSection("startups")} className="border border-cyan-800 text-cyan-400 rounded-md px-4 py-2 text-sm hover:bg-cyan-900 hover:border-cyan-500 transition-all duration-200 whitespace-nowrap">
                            + Schedule Meeting
                        </button>
                    </div>

                    {/* dynamic section */}
                    {renderSection()}


                </main>
            </div>
            {
                showInvestModal && (
                    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
                        <div className="bg-slate-900 w-[400px] p-6 rounded-xl border border-slate-700">
                            <h2 className="text-2xl font-bold mb-5">
                                Invest Amount
                            </h2>
                            <p className="text-gray-400 mb-4">
                                Entrepreneur :
                                <span className="text-cyan-400 text-lg"> {selectedEntrepreneur?.username}</span>
                            </p>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e)=>setAmount(e.target.value)}
                                placeholder="Enter amount"
                                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none"
                            />
                            {
                                paymentError &&
                                <p className="text-red-400 mt-2">
                                    {paymentError}
                                </p>
                            }
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={()=>{
                                        setShowInvestModal(false);
                                        setAmount("");
                                    }}
                                    className="px-4 py-2 rounded bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={loadingPayment}
                                    onClick={handleInvestment}
                                    className={`px-4 py-2 rounded bg-violet-600 ${
                                        loadingPayment
                                            ?
                                            "opacity-50 cursor-not-allowed"
                                            :
                                            ""
                                    }`}
                                >
                                    {
                                        loadingPayment
                                            ?
                                            "Processing..."
                                            :
                                            "Proceed Payment"
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )

}

export default InvestorDashboard