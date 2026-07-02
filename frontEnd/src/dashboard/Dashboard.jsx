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
import {Link, useNavigate} from "react-router-dom";
import socket from "../socket.js";
import {toast} from "react-toastify";
import {API_URL} from "../lib/api.js";

const Dashboard=()=>{
    const [users,setUsers]=useState([])
    const [meetings,setMeetings]=useState([])
    const [notifications,setNotifications]=useState([])
    const [documents,setDocuments]=useState([])
    const [singleMeeting,setSingleMeeting]=useState(null)
    const [transactions,setTransactions]=useState([])

    const [activeSection, setActiveSection] = useState('overview')
    const [sidebarOpen, setSidebarOpen] = useState(false)


    const navigate=useNavigate();
    const {user,isLoading}=useAuth();
    // console.log('logged in user ',user)

    // get all transactions
    const getTransactions=async ()=>{
        try {
            const response=await fetch(`${API_URL}/api/payment/getAll`,{
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
            console.log('transactions',data.payments)
            setTransactions(data?.payments)

        }catch (e) {
            console.log(e.message)
        }
    }

    const uploadDocuments=async (data)=>{
        try {
            const formData = new FormData();
            formData.append('file',data.file)
            formData.append('documentType',data.documentType)

            const response=await fetch(`${API_URL}/api/document//upload/:meetingId`,{
                method:"POST",
                credentials:'include',
                headers:{
                    'Content-Type':'multipart/form-data'
                },
                body:formData
            })
            const res=await response.json();
            if (!response.ok){
                throw new Error(res.message)
            }
            console.log(res)
        }catch (err){
            console.log(err.message)
        }
    }

    const fetchMeeting=async () => {
        try {
            const response = await fetch(`${API_URL}/api/meeting/single-meeting/${meetingId}`, {
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
            setSingleMeeting(data.meeting);
        }catch (e) {
            console.log(e.message)
        }
    }

    const fetchDocuments=async ()=>{
        try {
            const response=await fetch(`${API_URL}/api/document/getAllDocs`,{
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

    const logout=async ()=>{
        try {
            const response=await fetch(`${API_URL}/api/auth/logout`,{
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
            const response=await fetch(`${API_URL}/api/auth/get-all-users`,{
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
            // console.log(investors)
        }catch (err){
            console.log(err.message)
            alert(err.message)
        }
    }

    const getAllMeetings=async()=>{
        try {
            const response=await fetch(`${API_URL}/api/meeting/all-meetings`,{
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
            // console.log('meetings ',res.meetings)
        }catch(e){
            console.log(e)
        }
    }

    const getAllNotifications=async()=>{
        try {
            const response=await fetch(`${API_URL}/api/notification/getAllNotifications`,{
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
            // console.log('notifications',res)
            setNotifications(res.notifications)
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

    useEffect(() => {
        if (user?._id){
            socket.emit('register-user',user._id)
        }
    }, [user]);

    useEffect(() => {
        socket.on(
            "new-notification",
            (notification) => {
                console.log('notification',notification);
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
                fetchDocuments()
                getTransactions()

            }
        );
        return ()=>{
            socket.off(
                "dashboard-update"
            );
        };
    },[]);

    useEffect(()=>{
        // console.log(socket.id)
        getUsers()
        getTransactions()
        getAllMeetings()
        getAllNotifications()
        fetchDocuments()
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

    const statusColor = (status) => {
        if (status === 'accepted') return 'bg-green-600 text-white'
        if (status === 'pending') return 'bg-yellow-500 text-black'
        return 'bg-red-500 text-white'
    }

    if(isLoading){
        return (
            <div className="h-screen bg-[#0D1626] flex justify-center items-center w-full">
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
                        <h3 className="text-3xl font-bold text-gray-500">{acceptedMeetings.length}</h3>
                        <p className="text-[#8B9DC3] text-sm">Scheduled meetings</p>
                    </div>
                </div>
                <div className="bg-[#131B2D] text-center p-6 rounded-md border-2 border-red-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] shadow-red-400">
                    <div className="flex gap-2 justify-center items-center">
                        <img src={fileIcon} alt="documents" className="invert" width={32}/>
                        <p className="bg-red-300 px-2 rounded-full text-sm">{documents.length} Pending</p>
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
                        <h3 className="text-3xl font-bold text-yellow-400"><span className="text-green-500"> $</span>{user?.fundingNeeded}</h3>
                        <p className="text-[#8B9DC3] text-sm">Funding Needed</p>
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
                                    <p className="text-sm text-blue-400">{new Date(meeting.startTime).toLocaleString()}</p>
                                    <p className="text-sm">Scheduled for</p>
                                </div>
                                <div>
                                    <p className="font-medium">{meeting.agenda}</p>
                                    <p className="text-sm text-gray-500">with {meeting.investorId.username}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-blue-400">video</p>
                                    <img onClick={()=> setActiveSection('videoCall')} src={videoIcon} alt="video" className="invert" width={28}/>
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
                        <p onClick={()=> setActiveSection('documents')} className="text-sm text-blue-400 hover:text-blue-500 cursor-pointer">see all</p>
                    </div>
                    <div className="h-0.5 w-full bg-gray-500 mt-4"></div>
                    {documents.length > 0 ? (
                        documents.map((document,index) => (
                            <div key={index}>
                                <div className="flex justify-between items-center gap-2 p-4">
                                    <div>
                                        <p className="bg-violet-200 rounded-full p-2 text-violet-500">
                                            <img
                                                src={fileIcon}
                                                alt="file"
                                                width={28}
                                            />
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            {document?.documentType || 'Pitch Deck'}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Meeting Date : {new Date(document.meetingDate).toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm bg-yellow-200 rounded-full p-1 text-gray-700">
                                            Under Review
                                        </p>
                                    </div>
                                </div>
                                <div className="h-0.5 w-full bg-cyan-500 mt-4"></div>
                            </div>
                        ))
                    ) : (
                        <p className="text-lg ml-4 text-gray-500 p-3 mt-4">No Documents Uploaded yet!</p>
                    )}
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
                                    <img onClick={()=> navigate(`/video-call/${meeting._id}`)} src={videoIcon} alt="video" className="invert" width={28}/>
                                )}

                                {meeting.status === 'accepted' && (<Link className="hover:text-cyan-400 hover:border-b
                                border-cyan-400 transition-all duration-200" to={`/meeting/${meeting._id}`}>view details</Link>)}
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

    const renderDocuments=()=>(
        <div className='p-4'>
            <h2 className="text-2xl font-bold text-violet-400 mb-4">Uploaded Documents</h2>
            <div>
                {documents.length > 0 ? (
                    documents.map((doc) =>(
                        <div className="bg-gray-700 w-full h-full flex flex-col gap-3 p-3 ">
                            <div className="bg-gray-500 p-3 rounded-md flex justify-between items-center">
                                <div>
                                    <p className="text-violet-500 text-lg font-bold">{doc.documentType || 'Pitch Dark'}</p>
                                    <p className="text-gray-200 text-sm">Scheduled On : {new Date(doc.meetingDate).toLocaleString()}</p>
                                </div>
                                <a  className="text-gray-200 text-sm hover:text-violet-400" href={doc.fileUrl} target={"_blank"}>View Document</a>
                            </div>
                        </div>
                    ))
                ) : (<p className="text-gray-500 text-xl">No Documents Uploaded Yet!</p>)}
            </div>

        </div>
    )

    const renderChat =()=>(
        <div className='p-4'>
            <h2 className="text-2xl font-bold text-violet-400 mb-4">Connect with Investors</h2>
            <div className='bg-gray-800 rounded-md p-6'>
                {acceptedMeetings.length > 0 ? (
                    acceptedMeetings.map((meeting) => (
                        <div key={meeting._id} className="flex justify-between items-center gap-2 border p-4 border-violet-300 rounded-full">
                            <div>
                                <p className=' text-white flex '>Meeting with <span className='font-bold text-violet-500'> {meeting.investorId.username}</span></p>

                               <p className='text-yellow-400'> Agenda: <span className="text-gray-500 text-sm"> {meeting.agenda}</span></p>
                            </div>
                            <div>
                                <p className="text-gray-200">Scheduled on <span className="text-gray-500 text-sm"> {new Date(meeting.startTime).toLocaleString()}.</span></p>
                            </div>
                            <p className='text-sm bg-green-500 rounded-full p-1'>{meeting.status}</p>
                            <div>
                                <button
                                    onClick={()=> navigate(`/messages/${meeting._id}`)}
                                    className="bg-violet-500 text-sm px-8 py-2 rounded-md text-white
                                hover:bg-violet-600 transition-all duration-200">Start chat</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                        <img src={chatGif} alt="investors" className="invert opacity-30 mb-4" width={60}/>
                        <p className="text-gray-500 text-lg">Request Investors and connect with them.</p>
                    </div>
                )}
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
                        className="  w-24 h-24 md:w-32 md:h-32 rounded-full object-cover ring-4 ring-violet-600 shadow-md"/>
                    <h2 className="mt-4 text-xl md:text-3xl font-bold text-violet-400">
                        Mr. {user?.username}
                    </h2>
                    <p className="text-gray-400 text-sm md:text-lg capitalize">
                        {user?.role}
                    </p>
                    <p className="text-gray-300 text-sm md:text-base break-all mt-2">
                        Email: {user?.email}
                    </p>
                    <p className="text-gray-500 text-sm md:text-base break-all mt-2">Bio: {user?.bio || 'No Bio'}</p>
                </div>
                {/* Company */}
                <div className="w-full bg-[#152238] rounded-xl p-4">
                    <p className="text-violet-300 text-sm md:text-lg">
          <span className="text-blue-400 font-semibold">
            Company:
                        </span>{" "}
                        {user?.companyName || "No Company"}
                    </p>
                </div>
                {/* Wallet */}
                <div className="w-full bg-[#152238] rounded-xl p-4">
                    <h3 className="text-xl md:text-2xl text-gray-300 font-semibold mb-3">
                        Funding Needed
                    </h3>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <div className="bg-[#1B2A41] rounded-lg px-6 py-3">
                            <p className="text-green-500 font-bold">
                                Min
                            </p>
                            <p className="text-gray-300">
                                {user?.fundingNeeded || "0.00"}
                            </p>
                        </div>

                    </div>
                </div>
                {/* Industry */}
                <div className="w-full bg-[#152238] rounded-xl p-4">
                    <p className="text-gray-300 text-sm md:text-lg break-words">
          <span className="text-violet-400 font-semibold">
            Industry Interested In:
                   </span>{" "}
                        {user?.industry || "Tech"}
                    </p>
                </div>
            </div>
        </div>
    );

    const renderVideoCall = () => (
        <div className="p-4">
            <h2 className="text-xl font-bold text-violet-400 mb-4">Start Calling with Investors</h2>
            <div className="bg-[#0D1626] rounded-xl border border-gray-700 overflow-hidden">
                {acceptedMeetings.length > 0 ? (
                    acceptedMeetings.map((m) => (
                        <div key={m._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 border-b border-gray-800 hover:bg-[#111c30] transition-all duration-200">
                            <div className="flex items-center gap-3">
                                <img src={meetingGif} alt="meeting" className="invert" width={24} />
                                <div>
                                    <p className="text-sm font-medium text-white">{m.investorId.username || 'Meeting'}</p>
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

    // transactions section

    const renderTransactions = () => (
        <div className="p-4">
            <h2 className="text-2xl font-bold text-violet-400 mb-6">Investment Transactions</h2>

            {transactions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {transactions.map((t) => (
                        <div key={t._id} className="bg-[#0D1626] border border-cyan-900 rounded-2xl p-5 hover:border-purple-500
                        hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
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
                                <p className="text-xs text-purple-500">Entrepreneur</p>
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
                                {t.paymentStatus}
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


    const renderSection = () => {
        switch(activeSection){
            case 'overview':    return renderOverview()
            case 'meeting':     return renderMeetings()
            case 'notification':return renderNotifications()
            case 'investor':    return renderInvestors()
            case 'chat':        return renderChat()
            case 'videoCall':   return renderVideoCall()
            case 'documents':   return renderDocuments()
            case 'transactions':return renderTransactions()
            case 'profile':     return renderProfile()
            case 'settings':    return renderOverview()
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
                <div onClick={()=> setActiveSection('overview')} className="flex cursor-pointer items-center justify-center gap-1">
                    <p className="bg-white rounded-md text-violet-600 px-2 text-2xl font-bold">N</p>
                    <h2 className="text-3xl font-bold text-violet-600">Nexus</h2>
                </div>

                {/* Right side icons */}
                <div className="flex items-center gap-3">
                    <span onClick={()=> setActiveSection('notification')} className='h-5 w-5 cursor-pointer text-center top-3 md:top-5 rounded-full bg-red-500 text-white text-sm absolute z-30'>{notifications.length}</span>
                    <img onClick={()=> setActiveSection('notification')} className="invert hover:cursor-pointer hidden sm:block" src={notifGif} alt="notificationGif" width={30}/>
                    <img onClick={()=> setActiveSection('chat')} className="invert hover:cursor-pointer hidden sm:block" src={chatGif} alt="chatGif" width={30}/>
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
                                Good morning, <span className="text-violet-500">Mr. {user?.username.charAt(0).toUpperCase() + user?.username.slice(1)}</span>
                            </h2>
                            <p className="text-[#8B9DC3] text-sm">Here's what's happening on your Nexus dashboard today.</p>
                        </div>
                        <button onClick={()=> setActiveSection('investor')} className="border border-[#1A2A4A] rounded-md p-3 hover:bg-gray-700 hover:border-violet-400 transition-all duration-200 whitespace-nowrap">
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