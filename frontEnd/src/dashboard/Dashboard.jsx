import notifGif from "../../src/assets/notification.gif"
import chatGif from "../../src/assets/chat.gif"
import emailGif from "../../src/assets/email.gif"
import overviewGif from "../../src/assets/comic.png"
import meetingGif from "../../src/assets/meeting.gif"
import videoIcon from "../../src/assets/video.gif"
import investorIcon from "../../src/assets/investors.png"
import fileIcon from "../../src/assets/docs.gif"
import paymentIcon from "../../src/assets/payments.gif"
import transactionIcon from "../../src/assets/transactions.png"
import profileIcon from "../../src/assets/profile.gif"
import settingsIcon from "../../src/assets/setting.gif"
import friendsIcon from "../../src/assets/friends.png"
import walletIcon from "../../src/assets/wallet.png"
import crossIcon from "../../src/assets/cross.gif"
import questionIcon from "../../src/assets/question.png"
import graphIcon from "../../src/assets/graph.png"
import notificationIcon from "../../src/assets/notification.png"
import folderIcon from "../../src/assets/folder.gif"
import {useAuth} from "../../context/AuthContext.jsx";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import socket from "../socket.js";


const Dashboard=()=>{
    const [users,setUsers]=useState([])
    const [meetings,setMeetings]=useState([])
    const [notifications,setNotifications]=useState([])

    const [activeSection, setActiveSection] = useState('overview')
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const navigate=useNavigate();
    const {user,isLoading}=useAuth();

    const logout=async ()=>{
        try {
            const response=await fetch("http://localhost:3000/api/auth/logout",{
                method:"GET",
                credentials:'include',
                headers: {
                    'Accept': 'application/json',
                }
            })

            const res=await response.json();
            if(!response.ok){
                throw new Error(res.message)
            }
            alert("logout successfully")
            navigate("/login");

        }catch(e){
            console.log(e)
            alert(e.message)
        }
    }

    const getUsers=async()=>{
        try {
            const response=await fetch("http://localhost:3000/api/auth/get-all-users",{
                method:"GET",
                headers:{
                    'Content-Type': 'application/json',
                }
            })
            const res=await response.json();
            if(!response.ok){
                throw new Error(res.message)
            }
            const investors=res.users.filter(user=> user.role ==='investor')
            setUsers(investors)
            console.log(investors)
        }catch (err){
            console.log(err.message)
            alert(err.message)
        }
    }

    const getAllMeetings=async()=>{
        try {
            const response=await fetch("http://localhost:3000/api/meeting/all-meetings",{
                method:"GET",
                credentials:'include',
                headers:{
                    'Content-Type': 'application/json',
                }
            })
            const res=await response.json();
            if (!response.ok){
                throw new Error(res.message)
            }
            setMeetings(res.meetings)
            console.log('meetings ',res.meetings)
        }catch(e){
            console.log(e)
        }
    }

    const getAllNotifications=async()=>{
        try {
            const response=await fetch("http://localhost:3000/api/notification/getAllNotifications",{
                method:'GET',
                credentials:'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            const res=await response.json();
            if(!response.ok){
                throw new Error(res.message)
            }
            console.log('notifications',res)
            setNotifications(res.notifications)
        }catch (err){
            console.log(err.message)
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
            alert(res.message)
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
            alert(res.message)
        }catch (err){
            console.log(err.message)
        }
    }

    const acceptedMeetings=meetings.filter(m=> m.status === 'accepted')

    useEffect(() => {
        if (isLoading) return;

        if (!user) {
            navigate("/login");
            return;
        }

        if (user.role === "investor") {
            navigate("/investor-dashboard");
            return;
        }

        if (user.role !== "entrepreneur") {
            navigate("/login");
        }

    }, [user, isLoading, navigate]);

    useEffect(()=>{
        console.log(socket.id)
        getUsers()
        getAllMeetings()
        getAllNotifications()
    },[])

    const mainSection=[
        {id:'overview',title:'Overview',icon:overviewGif},
        {id:'notification',title:'Notification',icon:notifGif},
        {id:'chat',title:'Chat',icon:chatGif},
        {id:'meeting',title:'Meeting',icon:meetingGif},
    ]

    const collabSection=[
        {id:'investor',title:'Investor',icon:investorIcon},
        {id:'videoCall',title:'Video Call',icon:videoIcon},
        {id:'documents',title: 'Documents',icon: fileIcon}
    ]

    const financeSection=[
        {id:'payment',title:'Payment',icon:paymentIcon},
        {id:'transactions',title:'Transactions',icon:transactionIcon},
    ]

    const accountSection=[
        {id:'profile',title:'Profile',icon:profileIcon},
        {id:'settings',title:'Settings',icon:settingsIcon},
    ]

    const handleSectionClick = (id) => {
        setActiveSection(id)
        setSidebarOpen(false)
    }

    if(isLoading){
        return (
            <div className="h-screen flex justify-center items-center w-full">
                <p className="font-bold text-violet-500">loading</p>
            </div>
        )
    }


    const renderOverview = () => (
        <>
            {/* cards */}
            <div className="flex flex-wrap justify-around items-center gap-4 p-4">
                <div className="bg-[#131B2D] text-center p-6 rounded-md border-2 border-green-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] shadow-green-400">
                    <div className="flex gap-2 justify-center items-center">
                        <img src={friendsIcon} alt="friends" className="invert" width={32}/>
                        <p className="bg-green-600 px-2 rounded-full text-sm">+12%</p>
                    </div>
                    <div className="mt-1">
                        <h3 className="text-3xl font-bold text-green-600">45</h3>
                        <p className="text-[#8B9DC3] text-sm">Investor connections</p>
                    </div>
                </div>
                <div className="bg-[#131B2D] text-center p-6 rounded-md border-2 border-gray-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] shadow-gray-400">
                    <div className="flex gap-2 justify-center items-center">
                        <img src={meetingGif} alt="meeting" className="invert" width={32}/>
                        <p className="bg-gray-500 px-2 rounded-full text-sm">3 Today</p>
                    </div>
                    <div className="mt-1">
                        <h3 className="text-3xl font-bold text-gray-500">11</h3>
                        <p className="text-[#8B9DC3] text-sm">Scheduled meetings</p>
                    </div>
                </div>
                <div className="bg-[#131B2D] text-center p-6 rounded-md border-2 border-red-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] shadow-red-400">
                    <div className="flex gap-2 justify-center items-center">
                        <img src={fileIcon} alt="documents" className="invert" width={32}/>
                        <p className="bg-red-300 px-2 rounded-full text-sm">2 Pending</p>
                    </div>
                    <div className="mt-1">
                        <h3 className="text-3xl font-bold text-red-300">7</h3>
                        <p className="text-[#8B9DC3] text-sm">Shared Documents</p>
                    </div>
                </div>
                <div className="bg-[#131B2D] text-center p-6 rounded-md border-2 border-yellow-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] shadow-yellow-400">
                    <div className="flex gap-2 justify-center items-center">
                        <img src={walletIcon} alt="wallet" className="invert" width={32}/>
                        <p className="bg-yellow-400 px-2 rounded-full text-sm">Active</p>
                    </div>
                    <div className="mt-1">
                        <h3 className="text-3xl font-bold text-yellow-400"><span className="text-green-500">$</span>2.4K</h3>
                        <p className="text-[#8B9DC3] text-sm">Total wallet Balance</p>
                    </div>
                </div>
            </div>

            {/* meeting and investor cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-3">
                {/* Meetings */}
                <div className="bg-gray-800 p-3 rounded-md">
                    <div className="flex justify-between items-center gap-2">
                        <img src={meetingGif} alt="meeting" className="invert" width={28}/>
                        <p className="text-2xl font-bold text-[#ffffff40]">Upcoming Meetings</p>
                        <p onClick={() => handleSectionClick('meeting')} className="text-sm text-blue-400
                        hover:text-blue-500 cursor-pointer">see all</p>
                    </div>
                    <div className="h-0.5 w-full bg-gray-500 mt-4"></div>
                    {acceptedMeetings.length > 0 ? (
                        acceptedMeetings.slice(0,3).map((meeting) => (
                            <div key={meeting._id} className="flex justify-between items-center gap-2 p-2">
                                <div>
                                    <p className="text-sm text-blue-400">10Am</p>
                                    <p className="text-sm">Today</p>
                                </div>
                                <div>
                                    <p className="font-medium">Pitch Review Session</p>
                                    <p className="text-sm text-gray-500">with Sarah Malik · VC Fund</p>
                                </div>
                                <div>
                                    <p className="text-sm text-blue-400">video</p>
                                    <img src={videoIcon} alt="video" className="invert" width={28}/>
                                    <img src={crossIcon} alt="cross" className="invert" width={28}/>
                                </div>
                            </div>
                        ))
                    ) : (<p className="text-lg ml-4 text-gray-500 p-3 mt-4">No Meetings accepted yet! Schedule one.</p>)}
                    <div className="h-0.5 w-full bg-violet-600 mt-4"></div>
                </div>

                {/* Investors */}
                <div className="bg-gray-800 p-3 rounded-md">
                    <div className="flex justify-between items-center gap-2">
                        <img src={questionIcon} alt="question" className="invert" width={28}/>
                        <p className="text-2xl font-bold text-[#ffffff40]">Find Investors</p>
                        <p onClick={() => handleSectionClick('investor')} className="text-sm text-blue-400 hover:text-blue-500 cursor-pointer">Browse all</p>
                    </div>
                    <div className="h-0.5 w-full bg-gray-500 mt-4"></div>
                    {users.slice(0,2).map((user, index) => (
                        <div key={user._id} className="flex justify-between items-center gap-2 p-4">
                            <div>
                                <p className="bg-violet-200 rounded-full p-2 text-violet-500">{user.username}</p>
                            </div>
                            <div>
                                <p className="font-medium">{user.companyName}</p>
                                <p className="text-sm text-gray-500">Industry of Interest {user.industryInterested}</p>
                            </div>
                            <div>
                                <button onClick={()=> navigate(`/request-meeting/${user._id}`)} className="border border-gray-400 p-3 rounded-full hover:bg-gray-700 transition-all duration-200">Request Meeting</button>
                            </div>
                        </div>
                    ))}
                    <div className="h-0.5 w-full bg-cyan-500 mt-4"></div>
                </div>
            </div>

            {/* Activities and Documents */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-3">
                {/* Recent Activity */}
                <div className="bg-gray-800 p-3 rounded-md">
                    <div className="flex items-center gap-4">
                        <img src={graphIcon} alt="activities" className="invert" width={25}/>
                        <p className="text-2xl text-[#ffffff40] font-bold">Recent Activity</p>
                    </div>
                    <div className="h-0.5 w-full bg-gray-500 mt-4"></div>
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div key={notification._id}>
                                <div className="flex justify-between items-center gap-2 p-2">
                                    <img src={notificationIcon} alt="activities" className="invert" width={25}/>
                                    <div>
                                        <p className="text-yellow-400 font-medium">{notification.message}</p>
                                        <p className="text-sm text-gray-500">3 Hours ago</p>
                                    </div>
                                </div>
                                <div className="h-0.5 w-full bg-green-600 mt-2"></div>
                            </div>
                        ))
                    ) : (<p className="text-lg ml-4 text-gray-500 p-3 mt-4">No Notifications to show!</p>)}
                </div>

                {/* Documents */}
                <div className="bg-gray-800 p-3 rounded-md">
                    <div className="flex justify-between items-center gap-2">
                        <img src={folderIcon} alt="documents" className="invert" width={28}/>
                        <p className="text-2xl font-bold text-[#ffffff40]">Documents Chamber</p>
                        <p className="text-sm text-blue-400 hover:text-blue-500 cursor-pointer">see all</p>
                    </div>
                    <div className="h-0.5 w-full bg-gray-500 mt-4"></div>
                    <div className="flex justify-between items-center gap-2 p-4">
                        <div>
                            <p className="bg-violet-200 rounded-full p-2 text-violet-500">
                                <img src={fileIcon} alt={"file"} width={28}/>
                            </p>
                        </div>
                        <div>
                            <p className="font-medium">Pitch Deck v3.pdf</p>
                            <p className="text-sm text-gray-500">Shared with Sarah · 2.1 MB</p>
                        </div>
                        <div>
                            <p className="text-sm bg-yellow-200 rounded-full p-1 text-gray-700">under Review</p>
                        </div>
                    </div>
                    <div className="h-0.5 w-full bg-cyan-500 mt-4"></div>
                </div>
            </div>
        </>
    )

    const renderMeetings = () => (
        <div className="p-4">
            <h2 className="text-2xl font-bold text-violet-400 mb-4">All Meetings</h2>
            <div className="bg-gray-800 rounded-md">
                <div className="h-0.5 w-full bg-gray-500"></div>
                {meetings.length > 0 ? (
                    meetings.map((meeting) => (
                        <div key={meeting._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-4 border-b border-gray-700">
                            <div className="flex items-center gap-3">
                                <img src={meetingGif} alt="meeting" className="invert" width={28}/>
                                <div>
                                    <p className="font-medium text-white">Meeting Request</p>
                                    <p className="text-sm text-gray-400">{meeting.agenda || 'No description'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-xs px-3 py-1 rounded-full font-semibold
                                    ${meeting.status === 'accepted' ? 'bg-green-600 text-white' :
                                    meeting.status === 'pending' ? 'bg-yellow-500 text-black' :
                                        'bg-red-500 text-white'}`}>
                                    {meeting.status}
                                </span>
                                {meeting.status === 'accepted' && (
                                    <img src={videoIcon} alt="video" className="invert" width={28}/>
                                )}
                            </div>
                            <div className="space-x-3">
                                <button onClick={()=> acceptMeeting(meeting._id)} className="px-4 py-2 bg-violet-600 rounded-md hover:bg-violet-800
                                 transition-all duration-200">Accept</button>
                                <button onClick={()=> rejectMeeting(meeting._id)} className="px-4 py-2 bg-violet-600 rounded-md hover:bg-violet-800
                                 transition-all duration-200">Reject</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <img src={meetingGif} alt="meeting" className="invert opacity-30 mb-4" width={60}/>
                        <p className="text-gray-500 text-lg">No meetings yet.</p>
                        <p className="text-gray-600 text-sm mt-1">Request a meeting with an investor to get started.</p>
                    </div>
                )}
            </div>
        </div>
    )

    const renderNotifications = () => (
        <div className="p-4">
            <h2 className="text-2xl font-bold text-violet-400 mb-4">All Notifications</h2>
            <div className="bg-gray-800 rounded-md overflow-hidden">
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <div key={notification._id} className="flex items-center gap-4 p-4 border-b border-gray-700 hover:bg-gray-700 transition-all duration-200">
                            <img src={notificationIcon} alt="notification" className="invert shrink-0" width={28}/>
                            <div className="flex-1">
                                <p className="text-yellow-400 font-medium">{notification.message}</p>
                                <p className="text-sm text-gray-500 mt-1">3 Hours ago</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <img src={notifGif} alt="notifications" className="invert opacity-30 mb-4" width={60}/>
                        <p className="text-gray-500 text-lg">No notifications yet.</p>
                        <p className="text-gray-600 text-sm mt-1">You're all caught up!</p>
                    </div>
                )}
            </div>
        </div>
    )

    const renderInvestors = () => (
        <div className="p-4">
            <h2 className="text-2xl font-bold text-violet-400 mb-4">All Investors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {users.length > 0 ? (
                    users.map((user) => (
                        <div key={user._id} className="bg-gray-800 rounded-md p-5 flex flex-col gap-3 hover:border hover:border-violet-500 transition-all duration-200">
                            <div className="flex items-center gap-3">
                                <div className="bg-violet-200 rounded-full w-10 h-10 flex items-center justify-center text-violet-600 font-bold shrink-0">
                                    {user.username?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-white">{user.username}</p>
                                    <p className="text-sm text-gray-400">{user.companyName || 'No company'}</p>
                                </div>
                            </div>
                            <div className="text-sm text-gray-400">
                                <span className="text-gray-300">Industry: </span>
                                {user.industryInterested || 'N/A'}
                            </div>
                            <button
                                onClick={() => navigate(`/request-meeting/${user._id}`)}
                                className="mt-auto border border-violet-500 text-violet-400 py-2 px-4 rounded-full hover:bg-violet-600 hover:text-white transition-all duration-200 text-sm">
                                Request Meeting
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                        <img src={investorIcon} alt="investors" className="invert opacity-30 mb-4" width={60}/>
                        <p className="text-gray-500 text-lg">No investors found.</p>
                    </div>
                )}
            </div>
        </div>
    )

    const renderComingSoon = (label) => (
        <div className="flex flex-col items-center justify-center h-64 text-center p-8">
            <p className="text-4xl mb-4">🚧</p>
            <h3 className="text-xl font-bold text-gray-400">{label}</h3>
            <p className="text-gray-600 mt-2 text-sm">This section is coming soon. Stay tuned!</p>
        </div>
    )

    const renderSection = () => {
        switch(activeSection){
            case 'overview':    return renderOverview()
            case 'meeting':     return renderMeetings()
            case 'notification':return renderNotifications()
            case 'investor':    return renderInvestors()
            case 'chat':        return renderComingSoon('Chat')
            case 'videoCall':   return renderComingSoon('Video Call')
            case 'documents':   return renderComingSoon('Documents')
            case 'payment':     return renderComingSoon('Payment')
            case 'transactions':return renderComingSoon('Transactions')
            case 'profile':     return renderComingSoon('Profile')
            case 'settings':    return renderComingSoon('Settings')
            default:            return renderOverview()
        }
    }

    //  SIDEBAR ITEM
    const SidebarItem = ({ item }) => (
        <div
            onClick={() => handleSectionClick(item.id)}
            className={`flex gap-2 p-2 cursor-pointer rounded-md transition-all duration-200
                ${activeSection === item.id
                ? 'bg-violet-700 text-white'
                : 'hover:bg-slate-600 text-gray-300'}`}>
            <img className="invert" src={item.icon} alt={item.title} width={26}/>
            <p>{item.title}</p>
        </div>
    )

    return(
        <div className="min-h-screen text-white">

            {/* ── NAVBAR */}
            <nav className="w-full h-16 md:h-24 bg-[#0A0F1A] flex justify-between md:justify-around items-center gap-4 px-4 border-b border-violet-600 sticky top-0 z-40">
                {/* Hamburger button — only on mobile */}
                <button
                    onClick={() => setSidebarOpen(prev => !prev)}
                    className="md:hidden flex flex-col gap-1.5 p-2 rounded-md hover:bg-slate-700 transition-all duration-200"
                    aria-label="Toggle menu">
                    <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${sidebarOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${sidebarOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${sidebarOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </button>

                {/* Logo */}
                <div className="flex items-center justify-center gap-1">
                    <p className="bg-white rounded-md text-violet-600 px-2 text-2xl font-bold">N</p>
                    <h2 className="text-3xl font-bold text-violet-600">Nexus</h2>
                </div>

                {/* Right side icons */}
                <div className="flex items-center gap-3">
                    <img className="invert hover:cursor-pointer hidden sm:block" src={notifGif} alt="notificationGif" width={30}/>
                    <img className="invert hover:cursor-pointer hidden sm:block" src={chatGif} alt="chatGif" width={30}/>
                    <div className="hidden sm:flex items-center gap-3 ml-4 border p-2 rounded-md">
                        <img className="invert" src={emailGif} alt="notificationEmail" width={26}/>
                        <p className="text-sm">{user?.email || 'example@.com'}</p>
                    </div>
                    <img className="rounded-full" src={user?.profilePicture?.fileUrl} alt={'profilePicture'} width={30}/>
                </div>
            </nav>

            {/* ── LAYOUT */}
            <div className="flex relative">

                {/* MOBILE OVERLAY */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-20 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/*SIDEBAR */}
                <aside className={`
                    fixed top-16 left-0 h-[calc(100vh-4rem)] z-30
                    bg-[#0A0F1A] border-r border-violet-600
                    transform transition-transform duration-300 ease-in-out
                    w-[250px] overflow-y-auto
                    md:sticky md:top-0 md:translate-x-0 md:h-[calc(100vh-6rem)]
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}>
                    <div className="flex flex-col gap-2 p-2">
                        <p className="text-left font-medium text-gray-300 mt-2">Main</p>
                        {mainSection.map((item) => <SidebarItem key={item.id} item={item}/>)}
                    </div>
                    <div className="h-0.5 bg-gray-600 w-[90%] mx-auto"></div>

                    <div className="flex flex-col gap-2 p-2">
                        <p className="text-left font-medium text-gray-300 mt-2">Collaboration</p>
                        {collabSection.map((item) => <SidebarItem key={item.id} item={item}/>)}
                    </div>
                    <div className="h-0.5 bg-gray-600 w-[90%] mx-auto"></div>

                    <div className="flex flex-col gap-2 p-2">
                        <p className="text-left font-medium text-gray-300 mt-2">Finance</p>
                        {financeSection.map((item) => <SidebarItem key={item.id} item={item}/>)}
                    </div>
                    <div className="h-0.5 bg-gray-600 w-[90%] mx-auto"></div>

                    <div className="flex flex-col gap-2 p-2">
                        <p className="text-left font-medium text-gray-300 mt-2">Accounts</p>
                        {accountSection.map((item) => <SidebarItem key={item.id} item={item}/>)}
                        <button
                            onClick={logout}
                            className="px-4 py-2 bg-violet-600 rounded-md hover:bg-violet-800 transition-all duration-200">
                            LogOut
                        </button>
                    </div>
                </aside>

                {/* ── MAIN CONTENT */}
                <main className="flex-1 bg-[#0B0E14] min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-6rem)] overflow-x-hidden">
                    {/* Page header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4">
                        <div className="flex flex-col gap-1">
                            <h2 className="font-bold text-2xl md:text-4xl">
                                Good morning, <span className="text-violet-500">{user?.username}</span>
                            </h2>
                            <p className="text-[#8B9DC3] text-sm">Here's what's happening on your Nexus dashboard today.</p>
                        </div>
                        <button className="border border-[#1A2A4A] rounded-md p-3 hover:bg-gray-700 hover:border-[#00E5FF] transition-all duration-200 whitespace-nowrap">
                            <span>+</span> New Meeting
                        </button>
                    </div>

                    {/* Dynamic section content */}
                    {renderSection()}
                </main>
            </div>
        </div>
    )
}
export default Dashboard;